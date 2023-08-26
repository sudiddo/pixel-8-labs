import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('ERC721', function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let base: Contract; // contracts

  let adminRole: string;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const ERC721Preset = await ethers.getContractFactory('ERC721Preset');
    base = await ERC721Preset.deploy('token_uri', owner.address);
    adminRole = await base.connect(owner).DEFAULT_ADMIN_ROLE();
  });

  // Phases
  it('Should fail to setPhase without ADMIN role', async () => {
    await expect(base.connect(user).setPhase(2, true)).to.be.revertedWith(
      `AccessControl: account ${user.address.toLowerCase()} is missing role ${adminRole}`,
    );
    expect(await base.phase(0)).to.be.equal(true);
  });

  it('Should fail to set public price without ADMIN role', async () => {
    const p = await base.price(1);
    await expect(
      base.connect(user).setPrice(1, ethers.utils.parseEther('1')),
    ).to.be.revertedWith(
      `AccessControl: account ${user.address.toLowerCase()} is missing role ${adminRole}`,
    );
    expect(await base.price(1)).to.be.equal(p);
  });

  it('Should fail to set whitelist price without ADMIN role', async () => {
    const p = await base.price(2);
    await expect(
      base.connect(user).setPrice(2, ethers.utils.parseEther('1')),
    ).to.be.revertedWith(
      `AccessControl: account ${user.address.toLowerCase()} is missing role ${adminRole}`,
    );
    expect(await base.price(2)).to.be.equal(p);
  });

  it('Should fail to set whitelist signer address without ADMIN role', async () => {
    await expect(
      base.connect(user).setSigner(2, base.address),
    ).to.be.revertedWith(
      `AccessControl: account ${user.address.toLowerCase()} is missing role ${adminRole}`,
    );
  });

  it('Should set public price successfully', async function () {
    await base.setPrice(1, ethers.utils.parseEther('0.1'));
    expect(await base.price(1)).to.be.equal(ethers.utils.parseEther('0.1'));
  });

  it('Should set whitelist price successfully', async function () {
    await base.setPrice(2, ethers.utils.parseEther('0.1'));
    expect(await base.price(2)).to.be.equal(ethers.utils.parseEther('0.1'));
  });

  it('Should set whitelist signer address successfully', async function () {
    await base.setSigner(2, owner.address);
  });

  it('Should set public successfully', async function () {
    await base.setPhase(1, true);
    expect(await base.phase(1)).to.be.equal(true);
    expect(await base.phase(0)).to.be.equal(false);
  });

  it('Should set whitelist successfully', async function () {
    await base.setSigner(2, base.address);
    await base.setPhase(2, true);
    expect(await base.phase(2)).to.be.equal(true);
    expect(await base.phase(0)).to.be.equal(false);
  });

  it('Should set closed successfully', async function () {
    await base.setPhase(1, true);
    await base.setPhase(0, true);
    expect(await base.phase(0)).to.be.equal(true);
    expect(await base.phase(1)).to.be.equal(true);
  });

  // utils
  it('Should fail to setTokenURI without ADMIN role', async () => {
    const uri = await base.baseURI();
    await expect(base.connect(user).setTokenURI('abcd')).to.be.revertedWith(
      `AccessControl: account ${user.address.toLowerCase()} is missing role ${adminRole}`,
    );
    expect(await base.baseURI()).to.be.equal(uri);
  });

  it('Should set token uri successfully', async function () {
    await base.setTokenURI('new_token_uri');

    await base.airdrop(owner.address, 1);
    expect(await base.tokenURI(ethers.BigNumber.from(1))).to.be.equal(
      'new_token_uri/1.json',
    );
  });
});
