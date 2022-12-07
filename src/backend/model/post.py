from datetime import datetime
class Post:

    def __init__(self, post : str, timestamp : str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")):
        self.post = post
        self.timestamp = timestamp

    def fromJson(json):
        post = Post(json['post'])
        post.timestamp = json['timestamp']
        return post

    def toJson(self):
        return {
            'post': self.post,
            'timestamp': self.timestamp,
        }

    