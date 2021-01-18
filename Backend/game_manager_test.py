
import sys
import time
print(f'System path: {sys.path}')

from game_manager import GameManager

if __name__ == '__main__':
    game = GameManager()

    player_beacons = game.scan_for_players()
    for p in player_beacons:
        print(p)

    game.initialize_game(3)

    time.sleep(1)
    game.start_game_loop()
    time.sleep(20)
    print(f'\n\n Scan results during the race: \n')
    game.print_managers()
    game.stop_game_loop()

    
