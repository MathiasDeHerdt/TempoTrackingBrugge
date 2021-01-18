

import sys
print(f'System path: {sys.path}')

from tracking_manager import TrackingManager

tracking_manager = None

def create_tracker():
    global tracking_manager
    tracking_manager = TrackingManager()
    tracking_manager.initialize()

def setup_game():
    global tracking_manager
    tracking_manager.register_beacons_for_game()

def start_game_loop():
    global tracking_manager
    tracking_manager.begin_scanning_for_distance()
    stop = 0
    while stop != 9:
        stop = tracking_manager.show_menu_commands()

if __name__ == '__main__':
    try:
        print("Start program!...")
        create_tracker()
        setup_game()
        start_game_loop()

        sys.exit()
        print("finish program")
    except Exception as e:
        print("An exception occurred") 
        print(e)
