from datetime import datetime
class Post:

    def __init__(self, post : str, username : str, timestamp : str = None):
        self.post = post
        self.timestamp = timestamp if timestamp != None else datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        self.username = username

    def fromJson(json):
        return Post(json['post'], json['timestamp'], json['username'])

    def toJson(self):
        return {
            'post': self.post,
            'timestamp': self.timestamp,
            'username': self.username
        }

    