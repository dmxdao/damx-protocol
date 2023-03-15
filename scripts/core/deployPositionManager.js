const { deployContract, contractAt ,sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

const depositFee = 30 // 0.3%

async function getValues() {
  const { VAULT, SHORTS_TRACKER, ORDER_BOOK } = readTmpAddresses()

  const vault = await contractAt("Vault", VAULT)
  const router = await contractAt("Router", await vault.router())
  const shortsTracker = await contractAt("ShortsTracker", SHORTS_TRACKER)
  const weth = await contractAt("WETH", tokens.nativeToken.address)
  const orderBook = await contractAt("OrderBook", ORDER_BOOK)

  const orderKeepers = [
    "0xd9c7A9B28d4e68690Efde93216a0DbAC9D17176E",
    "0x58eEa5f3ADeBd324fA2Ee0558201A72b4FfCc163",
    "0x73F9eB7a8BA03276888ee0cEAE216593492de8F7"
  ]
  const liquidators = [
    "0x1851349b8DF1ed662081aD9eFCf8A2dD4F39D040",
    "0x4cf5e0f1aA90ccFda452C7625DCa76de1C8CA180",
    "0x81CA6A3130dA441642Ea916d852426F12F951fF6"
  ]

  const partnerContracts = []

  return { vault, router, shortsTracker, weth, depositFee, orderBook, orderKeepers, liquidators, partnerContracts }
}

async function main() {
  const {
    vault,
    router,
    shortsTracker,
    weth,
    depositFee,
    orderBook,
    orderKeepers,
    liquidators,
    partnerContracts
  } = await getValues()

  console.log("Deploying new position manager")

  const positionUtils = await deployContract("PositionUtils", [])

  const positionManagerArgs = [vault.address, router.address, shortsTracker.address, weth.address, depositFee, orderBook.address]
  const positionManager = await deployContract("PositionManager", positionManagerArgs, "PositionManager", {
    libraries: {
      PositionUtils: positionUtils.address
    }
  })
  await sendTxn(positionManager.setShouldValidateIncreaseOrder(false), "positionManager.setShouldValidateIncreaseOrder(false)")

  for (let i = 0; i < orderKeepers.length; i++) {
    const orderKeeper = orderKeepers[i]
    await sendTxn(positionManager.setOrderKeeper(orderKeeper, true), "positionManager.setOrderKeeper(orderKeeper)")
  }

  for (let i = 0; i < liquidators.length; i++) {
    const liquidator = liquidators[i]
    await sendTxn(positionManager.setLiquidator(liquidator, true), "positionManager.setLiquidator(liquidator)")
  }

  await sendTxn(vault.setLiquidator(positionManager.address, true), "vault.setLiquidator(liquidator, true)")
  await sendTxn(shortsTracker.setHandler(positionManager.address, true), "shortsTracker.setContractHandler(positionManager.address, true)")
  await sendTxn(router.addPlugin(positionManager.address), "router.addPlugin(positionManager)")

  for (let i = 0; i < partnerContracts.length; i++) {
    const partnerContract = partnerContracts[i]
    await sendTxn(positionManager.setPartner(partnerContract, true), "positionManager.setPartner(partnerContract)")
  }

  writeTmpAddresses({
    POSITION_UTIL: positionUtils.address,
    POSITION_MANAGER: positionManager.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
