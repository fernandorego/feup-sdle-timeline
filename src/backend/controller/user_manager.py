from kademlia.network import Server
from model.user import User
from server.dht_requests import set_dht_value, get_dht_value

import server.pki as pki
import bcrypt 

def getOrCreateUser(server : Server, username : str, password : str):
    user_json = get_dht_value(server, username)
    if user_json is None:
        public_key, private_key = pki.generate_PKI_key_pair()

        salt = bcrypt.gensalt()
        psw = bcrypt.hashpw(password.encode(encoding='utf-8'),salt)

        user = User(username, public_key.decode(encoding='utf-8'), psw.decode(encoding='utf-8'))
        
        set_dht_value(server, username, user)
    else:
        private_key = None
        user = User.fromJson(user_json)

        if(not bcrypt.checkpw( password.encode(encoding='utf-8'),user.password.encode(encoding='utf-8'))):
            print('User password does not match')
            user = None
            return user, private_key
            
        # TODO add timeline
    return user, private_key

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
