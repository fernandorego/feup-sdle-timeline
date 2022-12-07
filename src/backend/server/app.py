from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kademlia.network import Server
import controller.user_manager as user_manager
from model.post import Post
import json
import uvicorn

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

@api.post("/login/")
async def login(login: LoginAPI):
    global server
    username = login.username
    user = user_manager.getOrCreateUser(server, username)
    # timeline = user_manager.getTimeline(user)
    return {"message": "Login successful as " + login.username,
            'user': json.dumps(user.toJson(), default=vars)}

class PostAPI(BaseModel):
    username: str
    post: str

@api.post("/posts/create/")
async def login(post: PostAPI):
    user = user_manager.getUser(server, post.username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")

    post = Post(post.post)
    user.posts.append(post)
    user_manager.setUser(server, user.username, user)
    return {"message": "Post successfully published"}


class FollowAPI(BaseModel):
    username: str
    userToFollow: str

@api.post("/follow/") # TODO: need testing
async def follow(follow: PostAPI):
    user = user_manager.getUser(server, follow.username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")

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
