const { deployContract, contractAt , sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const { POSITION_ROUTER, POSITION_MANAGER, POSITION_UTIL } = readTmpAddresses()

  const positionRouter = await contractAt("PositionRouter", POSITION_ROUTER, null, {
    libraries: {
      PositionUtils: POSITION_UTIL
    }
  })
  const positionManager = await contractAt("PositionManager", POSITION_MANAGER, null, {
    libraries: {
      PositionUtils: POSITION_UTIL
    }
  })

  const referralStorage = await deployContract("ReferralStorage", [])

  await sendTxn(positionRouter.setReferralStorage(referralStorage.address), "positionRouter.setReferralStorage")
  await sendTxn(referralStorage.setHandler(positionRouter.address, true), "referralStorage.setHandler(positionRouter)")

  await sendTxn(positionManager.setReferralStorage(referralStorage.address), "positionManager.setReferralStorage")
  await sendTxn(referralStorage.setHandler(positionRouter.address, true), "referralStorage.setHandler(positionRouter)")

  writeTmpAddresses({
    REFERRAL_STORAGE: referralStorage.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
