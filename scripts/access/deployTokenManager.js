const { deployContract, writeTmpAddresses, sendTxn } = require("../shared/helpers")

async function main() {
  const tokenManager = await deployContract("TokenManager", [1], "TokenManager")

  const signers = [
    "0x76550dA2421b353226fE940636681C12e1F6d4FA",
  ]

  await sendTxn(tokenManager.initialize(signers), "tokenManager.initialize")

  writeTmpAddresses({
    TOKEN_MANAGER: tokenManager.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
