const { deployContract, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const rewardReader = await deployContract("RewardReader", [], "RewardReader")

  writeTmpAddresses({
    REWARD_READER: rewardReader.address,
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
