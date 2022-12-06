from kademlia.network import Server
from model.user import User
import json 
from server.dht_requests import set_dht_value, get_dht_value
async def getOrCreateUser(server : Server, username : str) :
    user_json = await get_dht_value(server, username)
    print('After get dht value')
    if user_json is None:
        user = User(username)
        await set_dht_value(server, username, user)
        
    else:
        user = User.fromJson(user_json)
        # TODO add timeline
    return user
