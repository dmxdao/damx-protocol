const { deployContract, contractAt, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const contract = await deployContract("VaultReader", [], "VaultReader")

  writeTmpAddresses({
    VAULT_READER: contract.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
