const { deployContract, writeTmpAddresses } = require("../shared/helpers")

async function main() {
  const referralReader = await deployContract("ReferralReader", [], "ReferralReader")
  writeTmpAddresses({
    REFERRAL_READER: referralReader.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
