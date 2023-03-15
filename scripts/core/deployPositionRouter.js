const { deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function main() {
  const { VAULT, ROUTER, SHORTS_TRACKER, POSITION_UTIL } = readTmpAddresses()

  const vault = await contractAt("Vault", VAULT)
  const router = await contractAt("Router", ROUTER)
  const weth = await contractAt("WETH", tokens.nativeToken.address)
  const shortsTracker = await contractAt("ShortsTracker", SHORTS_TRACKER)
  const depositFee = "30" // 0.3%
  const minExecutionFee = "100000000000000" // 0.0001 ETH

  const positionRouterArgs = [vault.address, router.address, weth.address, shortsTracker.address, depositFee, minExecutionFee]
  const positionRouter = await deployContract("PositionRouter", positionRouterArgs, "PositionRouter", {
    libraries: {
      PositionUtils: POSITION_UTIL
    }
  })

  await sendTxn(shortsTracker.setHandler(positionRouter.address, true), "shortsTracker.setHandler(positionRouter)")

  await sendTxn(router.addPlugin(positionRouter.address), "router.addPlugin")

  await sendTxn(positionRouter.setDelayValues(1, 180, 30 * 60), "positionRouter.setDelayValues")

  await sendTxn(positionRouter.setGov(await vault.gov()), "positionRouter.setGov")

  writeTmpAddresses({
    POSITION_ROUTER: positionRouter.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
