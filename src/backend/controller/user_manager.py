from kademlia.network import Server
from model.user import User
import json 
from server.dht_requests import set_dht_value, get_dht_value
def getOrCreateUser(server : Server, username : str) :
    user_json = get_dht_value(server, username)
    if user_json is None:
        user = User(username)
        set_dht_value(server, username, user)
        
    else:
        user = User.fromJson(user_json)
        # TODO add timeline
    return user
