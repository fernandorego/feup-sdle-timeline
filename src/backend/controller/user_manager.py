from kademlia.network import Server
from model.user import User
from server.dht_requests import set_dht_value, get_dht_value

def getOrCreateUser(server : Server, username : str) :
    user_json = get_dht_value(server, username)
    if user_json is None:
        user = User(username)
        set_dht_value(server, username, user)
        
    else:
        user = User.fromJson(user_json)
    return user

def getUser(server : Server, username : str) :
    user_json = get_dht_value(server, username)
    if user_json is None:
        return None        
    return User.fromJson(user_json)

def setUser(server : Server, username : str, user : User) :
    set_dht_value(server, username, user)

def setTimeline(server : Server, user : User) :
    user.addPostsTimeline(user.posts)
    for username in user.following:
        u = getUser(server, username)
        user.addPostsTimeline(u.posts)
