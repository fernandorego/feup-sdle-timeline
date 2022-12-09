from model.post import Post
class User:
    def __init__(self, username : str, public_key : str, password : str):
        self.username = username
        self.password = password
        self.public_key = public_key
        self.posts = []
        self.following = []

    def fromJson(json):
        user = User(json['username'], json['public_key'], json['password'])
        user.posts = [Post(post['post'], post['timestamp']) for post in json['posts']]
        user.following = json['following']
        return user

    def toJson(self):
        return {
            'username': self.username,
            'password': self.password,
            'public_key' : self.public_key,
            'posts': [post.toJson() for post in self.posts],
            'timeline' : [post.toJson() for post in self.posts],
            'following': self.following
        }

    