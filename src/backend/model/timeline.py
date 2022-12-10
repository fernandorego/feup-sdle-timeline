from model.post import Post
class Timeline:
    def __init__(self):
        self.posts = []

    def addPosts(self, posts):
        for i in range(len(posts)):
            self.posts.append(posts[i])
        self.posts.sort(key=lambda post: post.timestamp, reverse=True)
        print(self.posts)

    def fromJson(json):
        timeline = Timeline()
        timeline.posts = [Post(post['post'], post['timestamp']) for post in json['posts']]
        return timeline

    def toJson(self):
        return {
            'timeline': [post.toJson() for post in self.posts]
        }