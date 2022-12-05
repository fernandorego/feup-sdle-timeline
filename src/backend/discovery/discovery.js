const LIB_P2P = require('libp2p')
const TCP = require('libp2p-tcp')
const DHT = require('libp2p-kad-dht')
const MPLEX = require('libp2p-mplex')
const MDNS = require('libp2p-mdns')
const SECIO = require('libp2p-secio')
const PEER_ID = require('peer-id');
async function startNode(port) {    
    
    node = await LIB_P2P.create({
        peerId: await PEER_ID.create({ bits: 1024 }),
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/' + port],
        },
        modules: {
            transport: [TCP],
            streamMuxer: [MPLEX],
            connEncryption: [SECIO],
            peerDiscovery: [MDNS],
            dht: DHT,

        },
        config: {
            peerDiscovery: {
                autoDial: true,
                mdns: { 
                    interval: 20e3,
                    enabled: true,
                },
            },
            dht: {
                enabled: true,
            },
        }
    });

    

    node.on('peer:discovery', (peerId) => {
        console.log('Discovered:', peerId.toB58String())
    });
    node.connectionManager.on('peer:connect', (connection) => {
        console.log('Connection established to:', connection.remotePeer.toB58String())
    });
    node.on('peer:disconnect', (peer) => {
        console.log('Connection closed to:', peer.peerId.toB58String())
    });

    

    await node.start();
    console.log('Node started with ID:', node.peerId.toB58String());
    return node;
}

module.exports = { startNode: startNode };