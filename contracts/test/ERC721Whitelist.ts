import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('ERC721.whitelistMint()', function () {
  let owner: SignerWithAddress,
    allowed: SignerWithAddress,
    unAllowed: SignerWithAddress,
    signer: SignerWithAddress;
  let base: Contract; // contracts
  let whitelistPrice: BigNumber, publicPrice: BigNumber;

  const MAX_SUPPLY: number = 1000;
  const MAX_PER_TX: number = 20;

  beforeEach(async function () {
    [owner, allowed, unAllowed, signer] = await ethers.getSigners();

    const ERC721PresetWhitelist = await ethers.getContractFactory(
      'ERC721Preset',
    );
    base = await ERC721PresetWhitelist.deploy('token_uri', owner.address);

    publicPrice = await base.price(1);
    whitelistPrice = await base.price(2);

    await base.connect(owner).setSigner(2, signer.address);
    await base.setPhase(2, true);

    expect(await base.phase(2)).to.be.equal(true);
    expect(await base.phase(0)).to.be.equal(false);
  });

  async function getSignature(address: SignerWithAddress, quantity: number) {
    const payloadHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256'],
        [address.address, quantity],
      ),
    );

    const signature = await signer.signMessage(
      ethers.utils.arrayify(payloadHash),
    );

    return signature;
  }

  it('Should fail to mint zero', async function () {
    const maxAmount = 2;
    const signature = await getSignature(allowed, maxAmount);
    await expect(
      base.connect(allowed).whitelistMint(0, maxAmount, signature, {
        value: whitelistPrice.mul(0),
      }),
    ).to.be.revertedWith(`MintZeroQuantity()`);
    expect(await base.balanceOf(allowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it(`Should fail to mint more than their Max Amount`, async function () {
    const maxAmount = 2;
    const signature = await getSignature(allowed, maxAmount);
    await expect(
      base.connect(allowed).whitelistMint(maxAmount + 1, maxAmount, signature, {
        value: whitelistPrice.mul(maxAmount + 1),
      }),
    ).to.be.revertedWith(`ExceededMintQuota(${maxAmount + 1}, ${maxAmount})`);
    expect(await base.balanceOf(allowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it(`Should fail to mint more than ${MAX_SUPPLY}`, async () => {
    await base.setPhase(1, true);
    for (let i = 0; i < Math.floor(MAX_SUPPLY / MAX_PER_TX); i++) {
      await base
        .connect(owner)
        .mint(MAX_PER_TX, { value: publicPrice.mul(MAX_PER_TX) });
    }
    const maxAmount = 2;
    const signature = await getSignature(allowed, maxAmount);
    await expect(
      base.connect(allowed).whitelistMint(1, maxAmount, signature, {
        value: whitelistPrice.mul(1),
      }),
    ).to.be.revertedWith(`ExceededMaxSupply`);
    expect(await base.balanceOf(owner.address)).to.be.equal(MAX_SUPPLY);
    expect(await base.balanceOf(allowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(MAX_SUPPLY);
  });

  it(`Should fail to mint while already claimed more than their Max Amount`, async function () {
    const maxAmount = 3;
    const signature = await getSignature(allowed, maxAmount);
    await base.connect(allowed).whitelistMint(3, maxAmount, signature, {
      value: whitelistPrice.mul(maxAmount),
    });
    const signature2 = await getSignature(allowed, maxAmount);
    await expect(
      base.connect(allowed).whitelistMint(1, maxAmount, signature2, {
        value: whitelistPrice.mul(1),
      }),
    ).to.be.revertedWith(`'ExceededMintQuota(${maxAmount + 1}, ${maxAmount})`);
    expect(await base.balanceOf(allowed.address)).to.be.equal(3);
    expect(await base.claimed(allowed.address)).to.be.equal(3);
    expect(await base.totalSupply()).to.be.equal(3);
  });

  it('Should fail to mint without sufficient fund', async function () {
    const maxAmount = 1;
    const signature = await getSignature(allowed, maxAmount);
    await expect(
      base.connect(allowed).whitelistMint(1, maxAmount, signature),
    ).to.be.revertedWith(
      `InvalidOffer(${whitelistPrice}, ${await base.balanceOf(
        allowed.address,
      )})`,
    );
    expect(await base.balanceOf(allowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should fail to mint while not open', async () => {
    const signature = await getSignature(allowed, 1);
    await base.setPhase(0, true);
    await expect(
      base
        .connect(allowed)
        .whitelistMint(1, 1, signature, { value: whitelistPrice }),
    ).to.be.revertedWith(`MintNotOpened`);
    expect(await base.phase(0)).to.be.equal(true);
    expect(await base.phase(2)).to.be.equal(true);
    expect(await base.balanceOf(allowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should fail to mint while not whitelisted', async () => {
    const signature = await getSignature(allowed, 1);
    await expect(
      base
        .connect(unAllowed)
        .whitelistMint(1, 1, signature, { value: whitelistPrice }),
    ).to.be.revertedWith(`InvalidSignature`);
    expect(await base.balanceOf(unAllowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should fail to mint while signer address has not set yet', async () => {
    await base.connect(owner).setSigner(2, ethers.constants.AddressZero);
    const signature = await getSignature(allowed, 1);
    await expect(
      base
        .connect(allowed)
        .whitelistMint(1, 1, signature, { value: whitelistPrice }),
    ).to.be.revertedWith(`InvalidSignature`);
    expect(await base.balanceOf(allowed.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should mint successfully', async () => {
    const maxAmount = 3;
    const signature = await getSignature(allowed, maxAmount);
    await base
      .connect(allowed)
      .whitelistMint(1, maxAmount, signature, { value: whitelistPrice });
    expect(await base.balanceOf(allowed.address)).to.be.equal(1);
    expect(await base.totalSupply()).to.be.equal(1);
  });

  it('Should mint more than one successfully', async () => {
    const maxAmount = 3;
    const signature = await getSignature(allowed, maxAmount);
    await base.connect(allowed).whitelistMint(maxAmount, maxAmount, signature, {
      value: whitelistPrice.mul(maxAmount),
    });
    expect(await base.balanceOf(allowed.address)).to.be.equal(maxAmount);
    expect(await base.claimed(allowed.address)).to.be.equal(maxAmount);
    expect(await base.totalSupply()).to.be.equal(maxAmount);
  });
});
