const { contractAt, sendTxn, readTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const { GMX, ES_GMX, STAKED_GMX_DISTRIBUTOR, STAKED_GLP_DISTRIBUTOR, GMX_VESTER, GLP_VESTER } = readTmpAddresses()
const nftSaleAddr = ""

async function main() {
  const [deployer] = await ethers.getSigners();

  const gmx = await contractAt("GMX", GMX)
  const esGMX = await contractAt("EsGMX", ES_GMX)

  await sendTxn(gmx.setMinter(deployer.address, true), "gmx.setMinter")
  await sendTxn(esGMX.setMinter(deployer.address, true), "esGmx.setMinter")

  await sendTxn(esGMX.mint(deployer.address, expandDecimals(1250000, 18)), "esGmx.mint") // 1.25M(1%) Airdrop
  await sendTxn(esGMX.mint(nftSaleAddr, expandDecimals(12500000, 18)), "esGmx.mint") // 12.5M(10%) DMX robot NFT
  await sendTxn(esGMX.mint(STAKED_GMX_DISTRIBUTOR, expandDecimals(10000000, 18)), "esGmx.mint") // 10M
  await sendTxn(esGMX.mint(STAKED_GLP_DISTRIBUTOR, expandDecimals(10000000, 18)), "esGmx.mint") // 10M

  await sendTxn(gmx.mint(deployer.address, expandDecimals(10000000, 18)), "gmx.mint") // 10M(8%) for Liquidity
  await sendTxn(gmx.mint(GMX_VESTER, expandDecimals(10000000, 18)), "gmx.mint") // 10M
  await sendTxn(gmx.mint(GLP_VESTER, expandDecimals(10000000, 18)), "gmx.mint") // 10M

  await sendTxn(gmx.setMinter(deployer.address, false), "gmx.setMinter")
  // await sendTxn(esGMX.setMinter(deployer.address, false), "esGmx.setMinter")
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
