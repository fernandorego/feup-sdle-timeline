import argparse
import logging
import asyncio
import threading

from kademlia.network import Server
from server.app import start_api

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

def create_node(port):
    loop = asyncio.get_event_loop()
    loop.set_debug(True)

    loop.run_until_complete(server.listen(port))
    if port != BOOTSTRAP_PORT:
        bootstrap_node = (BOOTSTRAP_IP, port)
        loop.run_until_complete(server.bootstrap([bootstrap_node]))
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.stop()
        loop.close()
    print('Node created')
    return

def setup_node(port):
    ip = '127.0.0.1'
    start_api(ip, port)
    

def main():
    args = parse_arguments()
    port = args.port if args.port else BOOTSTRAP_PORT
    t1 = threading.Thread(target=setup_node, args=(port - 3000, ))
    t1.daemon = True
    t1.start()

    create_node(port)

if __name__ == "__main__":
    main()
