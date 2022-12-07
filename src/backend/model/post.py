from datetime import datetime
class Post:

    def __init__(self, post : str, timestamp : str = None):
        self.post = post
        self.timestamp = timestamp if timestamp != None else datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    def fromJson(json):
        post = Post(json['post'])
        post.timestamp = json['timestamp']
        return post

    def toJson(self):
        return {
            'post': self.post,
            'timestamp': self.timestamp,
        }

    