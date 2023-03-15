const { contractAt , sendTxn, readTmpAddresses } = require("../shared/helpers")

async function main() {
  const { REFERRAL_STORAGE } = readTmpAddresses()
  const referralStorage = await contractAt("ReferralStorage", REFERRAL_STORAGE)

  await sendTxn(referralStorage.setTier(0, 1000, 5000), "referralStorage.setTier 0")
  await sendTxn(referralStorage.setTier(1, 2000, 5000), "referralStorage.setTier 1")
  await sendTxn(referralStorage.setTier(2, 2500, 4000), "referralStorage.setTier 2")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
