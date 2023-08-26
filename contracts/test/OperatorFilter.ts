import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('OperatorFilterRegistry', function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let base: Contract; // contracts

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const ERC721Preset = await ethers.getContractFactory('ERC721Preset');
    base = await ERC721Preset.deploy('', owner.address);
  });

  // Phases
  it('Should transfer successfully', async () => {
    await base.airdrop(owner.address, 2);
    await base.transferFrom(owner.address, user.address, 1);
    expect(await base.balanceOf(owner.address)).to.be.equal(1);
  });
});
