

import sys
print(f'System path: {sys.path}')

from tracking_manager import TrackingManager

if __name__ == '__main__':
    try:
        print("Start program!...")
        tracking_manager = TrackingManager()

        tracking_manager.initialize()
        tracking_manager.register_beacons_for_game()

        tracking_manager.begin_scanning_for_distance()

        stop = 0
        while stop != 9:
            stop = tracking_manager.show_menu_commands()

        sys.exit()
        print("finish program")
    except Exception as e:
        print("An exception occurred") 
        print(e)