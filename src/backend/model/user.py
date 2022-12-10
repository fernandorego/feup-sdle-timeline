from model.post import Post
from model.timeline import Timeline
class User:
    def __init__(self, username : str, password : str = ''):
        self.username = username
        self.password = password # ignored for now
        self.posts = []
        self.following = []
        self.timeline = Timeline()

    def addPostsTimeline(self, posts):
        self.timeline.addPosts(posts)

    def addPost(self, post : Post):
        self.posts.append(post)
        self.timeline.addPosts([post])
        print()
        print('timeline ========================')
        print([post.toJson() for post in self.posts])
        print(self.timeline.posts)

    def fromJson(json):
        user = User(json['username'])
        user.password = json['password']
        user.posts = [Post(post['post'], post['timestamp']) for post in json['posts']]
        user.following = json['following']
        return user

    def toJson(self):
        return {
            'username': self.username,
            'password': self.password,
            'posts': [post.toJson() for post in self.posts],
            'following': self.following
        }

    