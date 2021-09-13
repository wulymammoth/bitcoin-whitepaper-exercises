"use strict";

const crypto = require("crypto");

const blockHash = (bl) => crypto.createHash("sha256").update(bl).digest("hex");

const createBlock = (data, chain = Blockchain) => {
	let block = {
		data: data,
		index: chain.blocks.length,
		prevHash: chain.blocks[chain.blocks.length - 1].hash,
		timestamp: Date.now(),
	};
	block.hash = blockHash(JSON.stringify(block));
	return block;
};

class InvalidBlockError extends Error {
	constructor(msg) {
		super(msg);
	}
}

const validPrevHash = (block, chain = Blockchain) => {
	const prevIndex = block.index - 1;
	if (block.index > 0 && block.prevHash != chain.blocks[prevIndex].hash) return false;
	return true;
};

const validHash = (block) => {
	if (block.index === 0) {
		return block.hash === "000000";
	} else {
		const meta = Object.assign({}, block); // make a copy of the block
		delete meta.hash; // remove the 'hash' key from the block
		return blockHash(JSON.stringify(meta)) === block.hash;
	}
};

const validBlock = (block) => {
	// `data` must be non-empty
	if (block.index != 0 && !block.data)
		throw new InvalidBlockError(`data cannot be null for block with index ${block.index}`);
	// `prevHash` must be non-empty
	if (block.index > 0 && !block.prevHash)
		throw new InvalidBlockError(`prevHash cannot be null (for non-geneis block) with index ${block.index}`);
	// `index` must be an integer >= `0`
	if (!validPrevHash(block)) throw new InvalidBlockError(`invalid previous hash for block index ${block.index}`);
	// the `hash` must match what recomputing the hash with `blockHash(..)` produces
	// for the genesis block only, the hash must be `"000000"`
	if (!validHash(block)) throw new InvalidBlockError(`invalid hash for block index ${block.index}`);
	return true;
};

const verifyChain = (chain) => {
	for (let i = 0; i < chain.blocks.length; i++) {
		const block = chain.blocks[i];
		try {
			validBlock(block);
		} catch (err) {
			console.log(err.message);
			return false;
		}
	}
	return true;
};

// **********************************

// The Power of a Smile
// by Tupac Shakur
const poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

const Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	data: "",
	hash: "000000",
	index: 0,
	timestamp: Date.now(),
});

poem.forEach((line) => Blockchain.blocks.push(createBlock(line, Blockchain)));

//Blockchain.blocks.forEach(console.log);

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);
