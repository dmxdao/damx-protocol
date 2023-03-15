const { deployContract, writeTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const addresses = {}
  addresses.BTC = (await callWithRetries(deployContract, ["FaucetToken", ["Bitcoin", "BTC", 8, expandDecimals(1, 8)], "BTC"])).address
  addresses.ETH = (await callWithRetries(deployContract, ["FaucetToken", ["ETH", "ETH", 18, expandDecimals(5, 18)]])).address
  addresses.LINK = (await callWithRetries(deployContract, ["FaucetToken", ["LINK", "LINK", 18, expandDecimals(1000, 18)]])).address
  addresses.USDT = (await callWithRetries(deployContract, ["FaucetToken", ["Tether", "USDT", 6, expandDecimals(1000, 6)]])).address

  writeTmpAddresses(addresses)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
