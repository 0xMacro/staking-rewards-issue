## Intro
This repo provides a test to prove the following issue.</br> 
The contract is copied from synthetix [repo](https://github.com/Synthetixio/synthetix/blob/c53070db9a93e5717ca7f74fcaf3922e991fb71b/contracts/StakingRewards.sol).

```
commit : c53070db9a93e5717ca7f74fcaf3922e991fb71b
branch : develop
```
## Issue: Rewards Distribution

**If `stake()` is not called in the same block of `notifyRewardAmount()`,**
**depending on delay, a portion of rewards will remain unused inside the contract**

### Failing Testcase
``./test/RewardsDistributionIssue``

The same issue is described in detail here</br> 
(it's for an extended version, so the names of variables are different, but the cause is same)</br>

https://www.notion.so/0xmacro/Rewards-distribution-076a3c6715144064b5b7b8dfff16c450



