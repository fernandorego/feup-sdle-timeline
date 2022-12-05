const LIB_P2P = require("libp2p");
const TCP = require("libp2p-tcp");
const DHT = require("libp2p-kad-dht");
const MPLEX = require("libp2p-mplex");
const MDNS = require("libp2p-mdns");
const SECIO = require("libp2p-secio");
const PEER_ID = require("peer-id");
const BOOTSTRAP = require("libp2p-bootstrap");
const debug = require('debug')('libp2p-bootstrap');
async function startNode(port) {
	const bootstraperNodes = require('./bootstrap');
	node = await LIB_P2P.create({

		peerId: await PEER_ID.create({ bits: 1024 }),
		addresses: {
			listen: ["/ip4/0.0.0.0/tcp/" + (port + 1)],
		},
		modules: {
			transport: [TCP],
			streamMuxer: [MPLEX],
			connEncryption: [SECIO],
			peerDiscovery: [BOOTSTRAP, MDNS],
			dht: DHT,
		},
		config: {
			peerDiscovery: {
				autoDial: true,
				[BOOTSTRAP.tag]: {
					enabled: true,
					list: bootstraperNodes,
				},
				[MDNS.tag]: {
					enabled: true,
				}
			},
			dht: {
				enabled: true,
			},
		},
	});

	node.on("peer:discovery", (peerId) => {
		console.log("Discovered:", peerId.toB58String());
	});
	node.connectionManager.on("peer:connect", (connection) => {
		console.log(
			"Connection established to:"
		);
	});
	node.on("peer:disconnect", (peer) => {
		console.log("Connection closed to:", peer.peerId.toB58String());
	});

	await node.start();
	console.log("Node started with ID:", node.peerId.toB58String());
	return node;
}

module.exports = { startNode: startNode };
