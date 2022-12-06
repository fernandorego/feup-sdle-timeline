const LIB_P2P = require("libp2p");
const TCP = require("libp2p-tcp");
const DHT = require("libp2p-kad-dht");
const MPLEX = require("libp2p-mplex");
const MDNS = require("libp2p-mdns");
const PEER_ID = require("peer-id");
const BOOTSTRAP = require("libp2p-bootstrap");
const encoder = require('../peerNode/encoder');
const { NOISE } = require("libp2p-noise");
async function startNode(port) {
	const bootstraperNodes = require('./bootstrap');
	const node = await LIB_P2P.create({

		peerId: await PEER_ID.create({ bits: 1024 }),
		addresses: {
			listen: ["/ip4/0.0.0.0/tcp/0"],
		},
		modules: {
			transport: [TCP],
			streamMuxer: [MPLEX],
			connEncryption: [NOISE],
			peerDiscovery: [BOOTSTRAP, MDNS],
			dht: DHT,
		},
		config: {
			peerDiscovery: {
				autoDial: true,
				[BOOTSTRAP.tag]: {
					enabled: false,
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
			"Connection established to:" + connection.remotePeer.toB58String()
		);
		node.peerStore.addressBook.add(connection.remotePeer, [connection.remoteAddr]);

	});
	node.on("peer:disconnect", (peer) => {
		console.log("Connection closed to:", peer.peerId.toB58String());
		
	});

	await node.start();
	console.log("Node started with ID:", node.peerId.toB58String());

  	console.log('Node has started:', node.isStarted())

	
	//node.startProvide = async function(){
	//	node.contentRouting.provide(await encoder.createCID(port + ''));
	//}

	return node;
}

module.exports = { startNode: startNode };
