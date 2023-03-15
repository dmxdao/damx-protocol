const { contractAt, sendTxn, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const { STAKED_GMX_DISTRIBUTOR, STAKED_GLP_DISTRIBUTOR, FEE_GMX_DISTRIBUTOR, FEE_GLP_DISTRIBUTOR } = readTmpAddresses()

async function main() {
  const stakedGmxDistributor = await contractAt("RewardDistributor", STAKED_GMX_DISTRIBUTOR)
  const stakedGlpDistributor = await contractAt("RewardDistributor", STAKED_GLP_DISTRIBUTOR)
  const feeGmxDistributor = await contractAt("RewardDistributor", FEE_GMX_DISTRIBUTOR)
  const feeGlpDistributor = await contractAt("RewardDistributor", FEE_GLP_DISTRIBUTOR)

  await sendTxn(stakedGmxDistributor.setTokensPerInterval(expandDecimals(1, 18)), "stakedGmxDistributor.setTokensPerInterval")
  await sendTxn(stakedGlpDistributor.setTokensPerInterval(expandDecimals(1, 18)), "stakedGlpDistributor.setTokensPerInterval")
  await sendTxn(feeGmxDistributor.setTokensPerInterval(expandDecimals(1, 18)), "feeGmxDistributor.setTokensPerInterval")
  await sendTxn(feeGlpDistributor.setTokensPerInterval(expandDecimals(1, 18)), "feeGlpDistributor.setTokensPerInterval")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
