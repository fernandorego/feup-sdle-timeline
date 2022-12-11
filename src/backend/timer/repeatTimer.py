from threading import Timer
import requests
import controller.user_manager as user_manager

class RepeatTimer(Timer):
    def run(self):  
        while not self.finished.wait(self.interval):  
            self.function(*self.args,**self.kwargs)

server = None
active_users = None
new_posts = None

def check_new_data(active_users_arg, server_arg, new_posts_arg):
    global active_users, server, new_posts
    active_users = active_users_arg
    server = server_arg
    new_posts = new_posts_arg

    print('refreshing data')
    for key in active_users:
        user = user_manager.getUser(server, key)

        if user is None:
            print('user is none')
            continue
        
        user_timestamps = [post.toJson()['timestamp'] for post in user.posts]

        for username in user.following:
            following_user = user_manager.getUser(server, username)
            if following_user is None:
                continue
            user_timestamps += [post.toJson()['timestamp'] for post in following_user.posts]

        if (len(user_timestamps) != len(active_users[key])):
            active_users[key] = user_timestamps + []
            new_posts[user.username] = True
        else:
            for i in range(len(user_timestamps)):
                if user_timestamps[i] in active_users[key] and not new_posts.get(user.username, False):
                    print('continue ' + user.username)
                    continue
                active_users[key] = user_timestamps + []
                new_posts[user.username] = True
                break
    print('done refreshing data')
    print(new_posts)
            