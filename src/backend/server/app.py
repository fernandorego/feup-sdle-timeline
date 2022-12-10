from fastapi import FastAPI, HTTPException, Response, status, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kademlia.network import Server
import controller.user_manager as user_manager
from model.post import Post
import server.pki as pki
import json
import uvicorn
from datetime import datetime

api = FastAPI()
server = None

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def start_api(ip : str, port : int, server_arg : Server):
    global server
    server = server_arg
    print('server ========================')
    print(server)
    
    uvicorn.run(api, host=ip, port=port)
              
@api.get("/")
async def main():
    return {"message": "Hello World"}

class LoginAPI(BaseModel):
    username: str
    password: str

@api.post("/login/")
async def login(login: LoginAPI):
    global server
    username = login.username
    password = login.password
    user, private_key = user_manager.getOrCreateUser(server, username, password)

    if user == None and private_key == None:
        raise HTTPException(status_code=401, detail="Invalid Password")
    # User already created 
    elif private_key == None:
        return {"message": "Login successful as " + login.username,
                'user': user.__dict__,
                'timeline': user.toJson()['timeline']}
    else:
        # TODO: timeline
        # timeline = user_manager.getTimeline(user)
        return {"message": "Login successful as " + login.username,
                'user': user.__dict__,
                'timeline': user.toJson()['timeline'],
                'private_key': private_key.decode(encoding='utf-8')}

class PostAPI(BaseModel):
    username: str
    signature : str
    post: str

@api.post("/posts/create/")
async def createPost(post: PostAPI):
    user = user_manager.getUser(server, post.username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")

    # Is post authentic (hammer-time should be signed in the front-end if we have time we will do it)

    verify_signature = pki.verify_signature(post.post, user.public_key, post.signature)

    if verify_signature:
        post = Post(post.post)
        user.posts.insert(0, post)
        user_manager.setUser(server, user.username, user)
        return {"message": "Post successfully published",
                'post': post.__dict__}
    else:
        raise HTTPException(status_code=401, detail="Error while authenticating message")


class FollowAPI(BaseModel):
    username: str
    target_username: str

@api.post("/follow/")
async def follow(follow: FollowAPI):
    if follow.target_username == follow.username:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    user = user_manager.getUser(server, follow.username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")

    if(follow.target_username in user.following):
        raise HTTPException(status_code=400, detail="User already followed")
    # Check if user exists
    userToFollow = user_manager.getUser(server, follow.target_username)

    if userToFollow is None:
        raise HTTPException(status_code=404, detail="User to follow not found")

    # Add username to followers
    user.following.append(follow.target_username)
    user_manager.setUser(server, user.username, user)
    return {"message": "User successfully followed"}

@api.post('/unfollow/')
async def unfollow(follow: FollowAPI):
    user = user_manager.getUser(server, follow.username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")

    if(follow.target_username not in user.following):
        raise HTTPException(status_code=400, detail="User not followed")
    # Check if user exists
    userToUnfollow = user_manager.getUser(server, follow.target_username)

    if userToUnfollow is None:
        raise HTTPException(status_code=404, detail="User to unfollow not found")

    # Add username to followers
    user.following.remove(follow.target_username)
    user_manager.setUser(server, user.username, user)
    return {"message": "User successfully unfollowed"}

    # Check if user exists
    userToFollow = user_manager.getUser(server, follow.userToFollow)

    if userToFollow is None:
        raise HTTPException(status_code=404, detail="User to follow not found")

    # Add username to followers
    user.following.append(follow.userToFollow)
    user_manager.setUser(server, user.username, user)
    return {"message": "User successfully followed"}

@api.get("/hello")
async def main():
    return {"message": "Hello World"}
