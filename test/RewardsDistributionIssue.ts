import { expect } from "chai";
import { ethers, network } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("Synthetix Staking Rewards", function () {
  let owner: SignerWithAddress;
  let staker: SignerWithAddress;

  // If `stake()` is not called in the same block of `notifyRewardAmount()`,
  // depending on delay, a portion of rewards will remain unused inside the contract

  it("Failing Testcase: Rewards Distribution Issue", async function () {
    [owner, staker] = await ethers.getSigners();
    const stakingToken = await (
      await ethers.getContractFactory("MockERC20")
    ).deploy();
    await stakingToken.deployed();
    const rewardsToken = await (
      await ethers.getContractFactory("MockERC20")
    ).deploy();
    await rewardsToken.deployed();

    // notifyRewardAmount
    const SR = await ethers.getContractFactory("StakingRewards");
    const sr = await SR.deploy(
      owner.address,
      owner.address,
      rewardsToken.address,
      stakingToken.address
    );
    await sr.deployed();
    const oneMonthSec = 2592000;
    await sr.setRewardsDuration(2592000);
    await rewardsToken.transfer(sr.address, 2592000);
    await sr.notifyRewardAmount(2592000);

    // delay
    await network.provider.send("evm_increaseTime", [3600]);

    // stake
    await stakingToken.transfer(staker.address, 100);
    await stakingToken.connect(staker).approve(sr.address, 100);
    await sr.connect(staker).stake(100);

    // reward distrivtion period is passed
    await network.provider.send("evm_increaseTime", [oneMonthSec * 2]);

    // claim rewards
    console.log(await rewardsToken.balanceOf(staker.address));
    expect(await rewardsToken.balanceOf(staker.address)).to.eq(0);
    await sr.connect(staker).getReward();
    expect(await rewardsToken.balanceOf(staker.address)).to.eq(oneMonthSec);

    // above balance comes as 2588398
    // so, as per current implementation, only 2588398 tokens can be distributed from the intended 2592000.
    // this difference between what the project intended to do and the actual will increase in direct proportion to delay.
    // this is not an exploitable scenario, it's just project's loss.
    // as of now, they will have to start a new cycle to distribute those unused tokens.
    // hence, consider defining periodFinish in the first stake done after notifyRewardAmount
  });
});
