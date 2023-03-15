const { deployContract, contractAt, sendTxn, readTmpAddresses, writeTmpAddresses } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const { VAULT, TOKEN_MANAGER, POSITION_ROUTER, POSITION_MANAGER, GLP_MANAGER, REWARD_ROUTER } = readTmpAddresses()

async function main() {
  const [deployer] = await ethers.getSigners();
  const admin = deployer.address
  const buffer = network === "ftmTestnet" ? 60 : 24 * 60 * 60
  const maxTokenSupply = expandDecimals("125000000", 18) // 125M

  const vault = await contractAt("Vault", VAULT)

  const deployedTimelock = await deployContract("Timelock", [
    admin,
    buffer,
    TOKEN_MANAGER,
    TOKEN_MANAGER, // mint receiver
    GLP_MANAGER,
    REWARD_ROUTER, // rewardRouter
    maxTokenSupply,
    10, // marginFeeBasisPoints 0.1%
    500 // maxMarginFeeBasisPoints 5%
  ], "Timelock")

  await sendTxn(deployedTimelock.setShouldToggleIsLeverageEnabled(true), "deployedTimelock.setShouldToggleIsLeverageEnabled(true)")
  await sendTxn(deployedTimelock.setContractHandler(POSITION_ROUTER, true), "deployedTimelock.setContractHandler(positionRouter)")
  await sendTxn(deployedTimelock.setContractHandler(POSITION_MANAGER, true), "deployedTimelock.setContractHandler(positionManager)")

  await sendTxn(vault.setGov(deployedTimelock.address), "vault.setGov")

  const signers = [
    deployer.address
  ]

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i]
    await sendTxn(deployedTimelock.setContractHandler(signer, true), `deployedTimelock.setContractHandler(${signer})`)
  }

  const keepers = [
    deployer.address
  ]

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i]
    await sendTxn(deployedTimelock.setKeeper(keeper, true), `deployedTimelock.setKeeper(${keeper})`)
  }

  writeTmpAddresses({
    TIME_LOCK: deployedTimelock.address
  })
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
