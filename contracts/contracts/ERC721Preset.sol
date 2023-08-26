//SPDX-License-Identifier: Unlicense
// Creator: Pixel8 Labs
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "erc721a/contracts/ERC721A.sol";
import "@sigpub/signatures-verify/Signature.sol";
import "closedsea/src/OperatorFilterer.sol";

error InvalidSignature();
error InvalidAmount(uint amount, uint max);
error InvalidOffer(uint256 price, uint256 offer);
error ExceededMaxSupply();
error ExceededMintQuota(uint amount, uint quota);
error InvalidSource();
error MintNotOpened();
error InvalidSigner(address signer);

contract ERC721Preset is ERC721A, ERC2981, PaymentSplitter, Ownable, AccessControl, ReentrancyGuard, OperatorFilterer {
    uint private constant MAX_SUPPLY = 1000;
    uint private maxPerTx = 20;
    string public baseURI;
    bool public operatorFilteringEnabled = true;

    // Phases
    enum Phases {
        CLOSED,
        PUBLIC,
        WHITELIST
    }
    mapping(Phases => address) public signer;
    mapping(Phases => bool) public phase;

    // Pricing
    mapping(Phases => uint256) public price;
    address[] public _payees = [
        0xf4FCD53F19F1a8d0675C96fE8DBfb12F20bcef37
    ];
    uint256[] private _shares = [100];

    // canMint modifier should contain the most common usecase between mint functions 
    // (e.g. public mint, private mint, free mint, airdrop)
    modifier canMint(uint amount, Phases p) {
        uint256 supply = totalSupply();
        if(amount > maxPerTx) revert InvalidAmount(amount, maxPerTx);
        if(msg.value != price[p] * amount) revert InvalidOffer(price[p] * amount, msg.value);
        if(supply + amount > MAX_SUPPLY) revert ExceededMaxSupply();
        if(msg.sender != tx.origin) revert InvalidSource();
        if(phase[Phases.CLOSED] == true) revert MintNotOpened();
        _;
    }

    constructor (
        string memory uri,
        address receiver
    ) ERC721A("ERC721PresetBase", "ERC721PB") PaymentSplitter(_payees, _shares) Ownable() { 
        baseURI = uri;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _registerForOperatorFiltering();
        _setDefaultRoyalty(receiver, 1000); // 1000 = 10%
        price[Phases.PUBLIC] = 0.01 ether;
        price[Phases.WHITELIST] = 0.005 ether;
        phase[Phases.CLOSED] = true;
    }

    // Metadata
    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();
        if (bytes(baseURI).length == 0) return "";

        return string(abi.encodePacked(baseURI, "/", _toString(tokenId), ".json"));
    }

    function mint(uint amount) external payable canMint(amount, Phases.PUBLIC) nonReentrant {
        if(!phase[Phases.PUBLIC]) revert MintNotOpened();

        _safeMint(msg.sender, amount);
    }

    function whitelistMint(uint64 amount, uint64 maxAmount, bytes memory signature) external payable canMint(amount, Phases.WHITELIST) nonReentrant {
        if(!phase[Phases.WHITELIST]) revert MintNotOpened();

        uint64 aux = _getAux(msg.sender);
        if(Signature.verify(maxAmount, msg.sender, signature) != signer[Phases.WHITELIST]) revert InvalidSignature();
        if(aux + amount > maxAmount) revert ExceededMintQuota(aux + amount, maxAmount);

        _setAux(msg.sender, aux + amount);
        _safeMint(msg.sender, amount);
    }

    function airdrop(address wallet, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 supply = totalSupply();
        if(supply + amount > MAX_SUPPLY) revert ExceededMaxSupply();
        _safeMint(wallet, amount);
    }
    
    function claimed(address target) external view returns (uint256) {
        return _getAux(target);
    }

    // Minting fee
    function setPrice(Phases _p, uint amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        price[_p] = amount;
    }
    function claim() external {
        release(payable(msg.sender));
    }

    function setTokenURI(string calldata uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = uri;
    }

    function setSigner(Phases _p, address value) external onlyRole(DEFAULT_ADMIN_ROLE) {
        signer[_p] = value;
    }

    // Phases
    function setPhase(Phases _phase, bool _status) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_phase == Phases.WHITELIST && signer[_phase] == address(0)) revert InvalidSigner(signer[_phase]);
        if(_phase != Phases.CLOSED) phase[Phases.CLOSED] = false;
        phase[_phase] = _status;
    }

    // Set default royalty to be used for all token sale
    function setDefaultRoyalty(address _receiver, uint96 _fraction) public onlyRole(DEFAULT_ADMIN_ROLE){ 
        _setDefaultRoyalty(_receiver, _fraction);
    }

    function setTokenRoyalty(uint256 _tokenId, address _receiver, uint96 _fraction) public onlyRole(DEFAULT_ADMIN_ROLE){
        _setTokenRoyalty(_tokenId, _receiver, _fraction);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, ERC2981, AccessControl) returns (bool) {
        return 
            ERC721A.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }

     // Operator Filter Registry
    bool filter;
    function transferFrom(address from, address to, uint256 tokenId) public payable override onlyAllowedOperator(from) {
        if(filter) {
            filteredTransferFrom(from, to, tokenId);
        } else {
            super.transferFrom(from, to, tokenId);
        }
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public payable override onlyAllowedOperator(from) {
        if(filter) {
            filteredSafeTransferFrom(from, to, tokenId);
        } else {
            super.safeTransferFrom(from, to, tokenId);
        }
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public payable override onlyAllowedOperator(from) {
        if(filter) {
            filteredSafeTransferFrom(from, to, tokenId, data);
        } else {
            super.safeTransferFrom(from, to, tokenId, data);
        }
    }

    function filteredTransferFrom(address from, address to, uint256 tokenId) public onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function filteredSafeTransferFrom(address from, address to, uint256 tokenId) public onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function filteredSafeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function _operatorFilteringEnabled() internal view override returns (bool) {
        return operatorFilteringEnabled;
    }

    function setOperatorFilteringEnabled(bool value) public onlyOwner {
        operatorFilteringEnabled = value;
    }

    function _isPriorityOperator(
        address operator
    ) internal pure override returns (bool) {
        return operator == address(0x1E0049783F008A0085193E00003D00cd54003c71);
    }
}
