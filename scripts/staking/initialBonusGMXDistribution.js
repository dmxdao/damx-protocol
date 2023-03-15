const { contractAt, sendTxn, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const { BN_GMX, BONUS_GMX_DISTRIBUTOR } = readTmpAddresses()

async function main() {
  const [deployer] = await ethers.getSigners();

  const bnGmx = await contractAt("MintableBaseToken", BN_GMX)

  await sendTxn(bnGmx.setMinter(deployer.address, true), "bnGmx.setMinter")

  await sendTxn(bnGmx.mint(BONUS_GMX_DISTRIBUTOR, expandDecimals(10000000, 18)), "bnGmx.mint") // 10M

  await sendTxn(bnGmx.setMinter(deployer.address, false), "bnGmx.setMinter")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
