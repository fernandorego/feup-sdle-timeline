import argparse
import logging
import asyncio
import threading

from kademlia.network import Server
from server.app import startServer

BOOTSTRAP_IP = "127.0.0.1"
BOOTSTRAP_PORT = 8000

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
    parser.add_argument("-i", "--ip", help="IP address of new node", type=str, default=None)
    parser.add_argument("-p", "--port", help="port number of new node", type=int, default=None)

    return parser.parse_args()


def connect_to_bootstrap_node(args):
    loop = asyncio.get_event_loop()
    loop.set_debug(True)

    loop.run_until_complete(server.listen(int(args.port)))
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

def create_node(args):
    if args.ip and args.port:
        connect_to_bootstrap_node(args)
    else:
        create_bootstrap_node()
    return

def setup_node(args):
    if args.ip and args.port:
        startServer(args.ip, args.port)
    else:
        startServer(BOOTSTRAP_IP, BOOTSTRAP_PORT)
    return

def main():
    args = parse_arguments()

    t1 = threading.Thread(target=setup_node, args=(args,))
    t1.start()

    create_node(args)

    t1.join()

if __name__ == "__main__":
    main()
