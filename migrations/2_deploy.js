const NFTCheeseTouch = artifacts.require("NFTCheeseTouch");

module.exports = async function (deployer) {
	await deployer.deploy(NFTCheeseTouch)
};