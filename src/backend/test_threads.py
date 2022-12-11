##Timers  
##Execute code at timed intervals  
##Imports and Displays  
import time  
from threading import Timer  
def display(msg):  
    print(msg + ' ' + time.strftime('%H:%M:%S'))  

##Lets make our timer run in intervals  
##Put it into a class  
##Making it run until we stop it  
##Just getting crazy.Notice We have multiple timers at once!  
class RepeatTimer(Timer):  
    def run(self):  
        while not self.finished.wait(self.interval):  
            self.function(*self.args,**self.kwargs)  
            print(' ')  
##We are now creating a thread timer and controling it  
timer = RepeatTimer(1,display,['Repeating'])  
timer.start() #recalling run  
print('Threading started')  
time.sleep(10)#It gets suspended for the given number of seconds  
print('Threading finishing')  
timer.cancel()