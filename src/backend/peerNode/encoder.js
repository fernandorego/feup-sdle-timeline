const { CID } = require('multiformats/cid')
const { sha256 } = require('multiformats/hashes/sha2')
const json = require('multiformats/codecs/json');
function encode(value) {
    return new TextEncoder().encode('/' + value);
}

function decode(value) {
    return new TextDecoder().decode(value).substring(1);
}

async function createCID(value) {
    const bytes = json.encode({ port: value })

    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, json.code, hash)
    return cid;
}

module.exports = { encode: encode, decode: decode, createCID: createCID };