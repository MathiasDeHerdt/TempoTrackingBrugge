
import sys
import time
print(f'System path: {sys.path}')

from backend_hardware.game_manager import GameManager

stop = False
player_finished_count = 0
player_array = ["17105c4098cc4564b7a0da5f05c87a45"]
    
def callback_etappe(callObj):
    print(f'Etappe done - game callback! - {callObj}')

def callback_finish(callObj):
    global player_finished_count
    print(f'Finished! - game callback! - {callObj}')
    player_finished_count += 1
    condition_stop()

def condition_stop():
    global stop
    global player_finished_count
    global player_array
    
    if (player_finished_count >= len(player_array)):
        stop = True


if __name__ == '__main__':
    game = GameManager()

    player_beacons = game.scan_for_players()
    for p in player_beacons:
        print(p)

    etappe_count = 3
    finish_width = 1.3
    game.initialize_game(etappe_count, finish_width, player_array, callback_etappe, callback_finish)

    time.sleep(1)
    game.start_game_loop()
    while stop == False:
        time.sleep(2)

    print(f'\n\n Scan results during the race: \n')
    game.print_managers()
    game.stop_game_loop()
