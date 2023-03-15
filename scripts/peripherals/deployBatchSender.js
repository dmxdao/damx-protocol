const { deployContract, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const batchSender = await deployContract("BatchSender", [])

  writeTmpAddresses({
    BATCH_SENDER: batchSender.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
