import json
class User:

    def __init__(self, username : str, password : str = ''):
        self.username = username
        self.password = password # ignored for now
        self.posts = []
        self.following = []

    def fromJson(self, json):
        self.username = json['username']
        self.password = json['password']
        self.posts = json['posts']
        self.following = json['following']

    def toJson(self):
        return {
            'username': self.username,
            'password': self.password,
            'posts': self.posts,
            'following': self.following
        }

    