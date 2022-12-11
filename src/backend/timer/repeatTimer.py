from threading import Timer
import controller.user_manager as user_manager

class RepeatTimer(Timer):
    def run(self):  
        while not self.finished.wait(self.interval):  
            self.function(*self.args,**self.kwargs)

server = None
active_users = None
def check_new_data(active_users_arg, server_arg):
    global active_users, server
    active_users = active_users_arg
    server = server_arg

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
            print('new post available')
        else:
            for i in range(len(user_timestamps)):
                if user_timestamps[i] in active_users[key]:
                    continue
                print('new post available')
                break
        
        print(key + ' - ' + str([x for x in active_users[key]]))