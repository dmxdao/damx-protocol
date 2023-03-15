const { contractAt, sendTxn, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];
const { VAULT } = readTmpAddresses()

async function main() {
  const vault = await contractAt("Vault", VAULT)
  const vaultGov = await vault.gov()

  const vaultTimelock = await contractAt("Timelock", vaultGov)
  const vaultMethod = "signalVaultSetTokenConfig"
  // const vaultMethod = "vaultSetTokenConfig"

  console.log("vault", vault.address)
  console.log("vaultTimelock", vaultTimelock.address)
  console.log("vaultMethod", vaultMethod)

  const { btc, eth, wftm, usdc, usdt, dai } = tokens
  const tokenArr = [btc, eth, wftm, usdc, usdt, dai]

  for (const token of tokenArr) {
    await sendTxn(vaultTimelock[vaultMethod](
      vault.address,
      token.address, // _token
      token.decimals, // _tokenDecimals
      token.tokenWeight, // _tokenWeight
      token.minProfitBps, // _minProfitBps
      expandDecimals(token.maxUsdgAmount, 18), // _maxUsdgAmount
      token.isStable, // _isStable
      token.isShortable // _isShortable
    ), `vault.${vaultMethod}(${token.name}) ${token.address}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
