"use strict";

var crypto = require("crypto");

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	data: "",
	hash: "000000",
	index: 0,
	timestamp: Date.now(),
});

poem.forEach((line) => Blockchain.blocks.push(createBlock(Blockchain, line)));

Blockchain.blocks.forEach(console.log);

// console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);

// **********************************

function blockHash(bl) {
	return crypto.createHash("sha256").update(bl).digest("hex");
}

function createBlock(chain, data) {
	let block = {
		data: data,
		index: chain.blocks.length,
		prevHash: chain.blocks[chain.blocks.length - 1].hash,
		timestamp: Date.now(),
	};
	block.hash = blockHash(JSON.stringify(block));
	return block;
}
