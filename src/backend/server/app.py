from fastapi import FastAPI, HTTPException, Response, status, Response, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kademlia.network import Server
import controller.user_manager as user_manager
from model.post import Post
import server.pki as pki
import json
import uvicorn
import asyncio
from timer.repeatTimer import RepeatTimer, check_new_data
from sse_starlette.sse import EventSourceResponse


api = FastAPI()
server = None
active_users = {}
newPosts = {}

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

    timer = RepeatTimer(5,check_new_data,[active_users, server, newPosts])
    timer.daemon = True
    timer.start()
    
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


    user_manager.setTimeline(server, user)
    active_users[username] = [post.toJson()['timestamp'] for post in user.posts]

    if user == None and private_key == None:
        raise HTTPException(status_code=401, detail="Invalid Password")
    
    # User already created 
    elif private_key == None:
        return {"message": "Login successful as " + login.username,
                'user': user.__dict__,
                'timeline': user.timeline.toJson()}
    else:
        return {"message": "Login successful as " + login.username,
                'user': user.__dict__,
                'timeline': user.timeline.toJson(),
                'private_key': private_key.decode(encoding='utf-8')}

class PostAPI(BaseModel):
    username: str
    signature : str
    post: str

@api.post("/posts/create/")
async def createPost(post: PostAPI):
    print('signature')
    print(post.signature.encode(encoding="ptcp154"))
    print('here')
    user = user_manager.getUser(server, post.username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")

    # Is post authentic (hammer-time should be signed in the front-end if we have time we will do it)
    verify_signature = pki.verify_signature(post.post, user.public_key, post.signature.encode(encoding="ptcp154"))
    
    if not verify_signature:
        raise HTTPException(status_code=401, detail="Error while authenticating message")

    post = Post(post.post, user.username)
    user.addPost(post)
    active_users[user.username].append(post.timestamp)
    user_manager.setUser(server, user.username, user)
    return {"message": "Post successfully published",
            'post': post.__dict__}


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
    return {"message": "User " + follow.target_username + " successfully followed"}

@api.get('/refresh-timeline/{username}')
async def refreshTimeline(username: str):
    user = user_manager.getUser(server, username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not logged in")
    user_manager.setTimeline(server, user)
    return {"message": "Timeline successfully refreshed",
            'timeline': user.timeline.toJson()}

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
    return {"message": "User " + follow.target_username + " successfully unfollowed"}

class SignAPI(BaseModel):
    privateKey: str
    post: str

@api.post("/sign")
async def sign(follow: SignAPI):

    result = pki.sign_message(message=follow.post , private_key= follow.privateKey)

    print(result.decode(encoding="ptcp154"))

    return {"signature":result.decode(encoding="ptcp154")}

STREAM_DELAY = 1  # second
RETRY_TIMEOUT = 15000  # milisecond

@api.get('/update/{username}')
async def message_stream(username:str, request: Request):
    async def event_generator(username):
        while True:

            if await request.is_disconnected():
                break
            if newPosts.get(username, False):
                newPosts[username] = False
                yield {
                        "data": "update"
                }

            await asyncio.sleep(STREAM_DELAY)

    return EventSourceResponse(event_generator(username))

