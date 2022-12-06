import asyncio
from kademlia.network import Server
import json

def set_dht_value(server : Server, key : str, value) :
    json_value = json.dumps(value.toJson())
    print(f'Setting {key} = {json_value}')
    return asyncio.run_coroutine_threadsafe(server.set(key, json_value) , server.loop).result()
    
def get_dht_value(server : Server, key : str) :
    value = asyncio.run_coroutine_threadsafe(server.get(key), server.loop).result()
    
    print(f'Getting {key} = {value}')
    if value is None:
        return None
    return json.loads(value)
