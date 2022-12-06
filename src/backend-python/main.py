import argparse
import logging
import asyncio

from kademlia.network import Server

BOOTSTRAP_IP = "127.0.0.1"
BOOTSTRAP_PORT = 8468

handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
log = logging.getLogger('kademlia')
log.addHandler(handler)
log.setLevel(logging.DEBUG)

server = Server()


def parse_arguments():
    parser = argparse.ArgumentParser()

    # Optional arguments
    parser.add_argument("-i", "--ip", help="IP address of new  node", type=str, default=None)
    parser.add_argument("-p", "--port", help="port number of new node", type=int, default=None)

    return parser.parse_args()


def connect_to_bootstrap_node(args):
    loop = asyncio.get_event_loop()
    loop.set_debug(True)

    loop.run_until_complete(server.listen(8469))
    bootstrap_node = (BOOTSTRAP_IP, BOOTSTRAP_PORT)
    loop.run_until_complete(server.bootstrap([bootstrap_node]))

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.stop()
        loop.close()


def create_bootstrap_node():
    loop = asyncio.get_event_loop()
    loop.set_debug(True)

    loop.run_until_complete(server.listen(BOOTSTRAP_PORT))

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.stop()
        loop.close()

def setup_node(server):
    pass

def main():
    args = parse_arguments()

    if args.ip and args.port:
        connect_to_bootstrap_node(args)
    else:
        create_bootstrap_node()
    
    setup_node(server)


if __name__ == "__main__":
    main()
