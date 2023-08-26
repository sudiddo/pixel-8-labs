import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('ERC721.mint()', function () {
  let owner: SignerWithAddress;
  let base: Contract; // contracts
  let price: BigNumber;

  const MAX_SUPPLY: number = 1000;
  const MAX_PER_TX: number = 20;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const ERC721PresetPublic = await ethers.getContractFactory('ERC721Preset');
    base = await ERC721PresetPublic.deploy('token_uri', owner.address);
    price = await base.price(1);
    await base.setPhase(1, true);
    expect(await base.phase(1)).to.be.equal(true);
    expect(await base.phase(0)).to.be.equal(false);
  });

  it('Should fail to mint zero', async function () {
    await expect(base.mint(0)).to.be.revertedWith('MintZeroQuantity()');
    expect(await base.balanceOf(owner.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it(`Should fail to mint more than ${MAX_PER_TX}`, async function () {
    await expect(
      base.mint(MAX_PER_TX + 1, {
        value: price.mul(MAX_PER_TX + 1),
      }),
    ).to.be.revertedWith(`InvalidAmount(${MAX_PER_TX + 1}, ${MAX_PER_TX})`);
    expect(await base.balanceOf(owner.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should fail to mint without sufficient fund', async function () {
    await expect(base.mint(1)).to.be.revertedWith(`InvalidOffer(${price}, 0)`);
    expect(await base.balanceOf(owner.address)).to.be.equal(0);
    expect(await base.totalSupply()).to.be.equal(0);
  });

  it('Should mint one successfully', async function () {
    await base.mint(1, { value: price });
    expect(await base.balanceOf(owner.address)).to.be.equal(1);
    expect(await base.totalSupply()).to.be.equal(1);
  });

  it('Should mint 10 successfully', async function () {
    await base.mint(10, { value: price.mul(10) });
    expect(await base.balanceOf(owner.address)).to.be.equal(10);
    expect(await base.totalSupply()).to.be.equal(10);
  });

  it('Should mint 20 successfully', async function () {
    await base.mint(20, { value: price.mul(20) });
    expect(await base.balanceOf(owner.address)).to.be.equal(20);
    expect(await base.totalSupply()).to.be.equal(20);
  });

  it('Should mint all successfully and fail to mint more than max supply', async function () {
    for (let i = 0; i < Math.floor(MAX_SUPPLY / MAX_PER_TX); i++) {
      await base.mint(MAX_PER_TX, { value: price.mul(MAX_PER_TX) });
    }

    const remainder = MAX_SUPPLY % MAX_PER_TX;
    if (remainder > 0) {
      await base.mint(remainder, { value: price.mul(remainder) });
    }
    expect(await base.balanceOf(owner.address)).to.be.equal(MAX_SUPPLY);
    expect(await base.ownerOf(1)).to.be.equal(owner.address);
    expect(await base.ownerOf(MAX_SUPPLY)).to.be.equal(owner.address);
    expect(await base.totalSupply()).to.be.equal(MAX_SUPPLY);

    await expect(base.ownerOf(0)).to.be.reverted;
    await expect(base.ownerOf(MAX_SUPPLY + 1)).to.be.reverted;

    // mint more than max
    await expect(base.mint(1, { value: price.mul(1) })).to.be.revertedWith(
      'ExceededMaxSupply',
    );
    expect(await base.balanceOf(owner.address)).to.be.equal(MAX_SUPPLY);
    expect(await base.totalSupply()).to.be.equal(MAX_SUPPLY);
  });
});
