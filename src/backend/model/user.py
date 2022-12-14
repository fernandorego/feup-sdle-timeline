from model.post import Post
from model.timeline import Timeline
class User:
    def __init__(self, username : str, public_key : str, password : str):
        self.username = username
        self.password = password
        self.public_key = public_key
        self.posts = []
        self.following = []
        self.timeline = Timeline()

    def addPostsTimeline(self, posts):
        self.timeline.addPosts(posts)

    def addPostTimeline(self, post : Post):
        self.timeline.addPosts([post])

    def addPost(self, post : Post):
        self.posts.append(post)

    def fromJson(json):
        user = User(json['username'], json['public_key'], json['password'])
        user.posts = [Post(post['post'], post['username'], post['timestamp']) for post in json['posts']]
        
        user.following = json['following']
        return user

    def toJson(self):
        return {
            'username': self.username,
            'password': self.password,
            'public_key' : self.public_key,
            'posts': [post.toJson() for post in self.posts],
            'following': self.following
        }

    