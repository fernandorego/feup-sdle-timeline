from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kademlia.network import Server
import controller.user_manager as user_manager
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

class Login(BaseModel):
    username: str

@api.post("/login/")
async def login(login: Login):
    global server
    print(login.username)
    username = login.username
    user = user_manager.getOrCreateUser(server, username)
    return {"message": "Login successful as " + login.username,
            'user': json.dumps(user.__dict__, default=vars)}

class Post(BaseModel):
    username: str
    post: str

@api.post("/posts/create/")
async def login(post: Post):
    print("Username: " + post.username)
    print("Post: " + post.post)
    return {"message": "Post successfully published"}

@api.get("/hello")
async def main():
    return {"message": "Hello World"}
