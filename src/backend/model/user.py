import json
class User:

    def __init__(self, username : str, password : str = ''):
        self.username = username
        self.password = password # ignored for now
        self.posts = []
        self.following = []

    def fromJson(json):
        user = User(json['username'])
        user.password = json['password']
        user.posts = json['posts']
        user.following = json['following']
        return user

    def toJson(self):
        return {
            'username': self.username,
            'password': self.password,
            'posts': self.posts,
            'following': self.following
        }

    