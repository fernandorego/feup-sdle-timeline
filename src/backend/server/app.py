from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def start_api(ip, port):
    import uvicorn
    uvicorn.run(api, host=ip, port=port)

@api.get("/")
async def main():
    return {"message": "Hello World"}

class Login(BaseModel):
    username: str

@api.post("/login/")
async def login(login: Login):
    print(login.username)
    return {"message": "Login successful as " + login.username}

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