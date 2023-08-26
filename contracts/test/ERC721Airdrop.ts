import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('ERC721.airdrop()', function () {
  let owner: SignerWithAddress;
  let base: Contract; // contracts

  const MAX_SUPPLY: number = 1000;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const ERC721PresetAirdrop = await ethers.getContractFactory('ERC721Preset');
    base = await ERC721PresetAirdrop.deploy('token_uri', owner.address);
  });

  it('Should fail to airdrop zero', async function () {
    await expect(base.airdrop(owner.address, 0)).to.be.revertedWith(
      'MintZeroQuantity()',
    );
    expect(await base.balanceOf(owner.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should airdrop one successfully', async function () {
    await base.airdrop(owner.address, 1);
    expect(await base.balanceOf(owner.address)).to.be.equal(1);
    expect(await base.totalSupply()).to.be.equal(1);
  });

  it('Should airdrop 10 successfully', async function () {
    await base.airdrop(owner.address, 10);
    expect(await base.balanceOf(owner.address)).to.be.equal(10);
    expect(await base.totalSupply()).to.be.equal(10);
  });

  it('Should mint airdrop successfully', async function () {
    await base.airdrop(owner.address, 20);
    expect(await base.balanceOf(owner.address)).to.be.equal(20);
    expect(await base.totalSupply()).to.be.equal(20);
  });

  it('Should mint all successfully and fail to mint more than max supply', async function () {
    await base.airdrop(owner.address, MAX_SUPPLY);

    expect(await base.balanceOf(owner.address)).to.be.equal(MAX_SUPPLY);
    expect(await base.ownerOf(1)).to.be.equal(owner.address);
    expect(await base.ownerOf(MAX_SUPPLY)).to.be.equal(owner.address);
    expect(await base.totalSupply()).to.be.equal(MAX_SUPPLY);

    await expect(base.ownerOf(0)).to.be.reverted;
    await expect(base.ownerOf(MAX_SUPPLY + 1)).to.be.reverted;

    // mint more than max
    await expect(base.airdrop(owner.address, 1)).to.be.revertedWith(
      'ExceededMaxSupply',
    );

    expect(await base.balanceOf(owner.address)).to.be.equal(MAX_SUPPLY);
    expect(await base.totalSupply()).to.be.equal(MAX_SUPPLY);
  });
});
