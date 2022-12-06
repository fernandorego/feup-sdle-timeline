import asyncio
from kademlia.network import Server
import json

async def set_dht_value(server : Server, key : str, value) :
    json_value = json.dumps(value.toJson())
    print(f'Setting {key} = {json_value}')
    return await server.set(key, json_value) 
    
async def get_dht_value(server : Server, key : str) :
    value = await server.get(key)
    
    print(f'Getting {key} = {value}')
    if value is None:
        return None
    return json.loads(value)
