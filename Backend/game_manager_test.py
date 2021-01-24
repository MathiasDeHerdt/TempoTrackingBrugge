
import sys
import time
print(f'System path: {sys.path}')

from backend_hardware.game_manager import GameManager


# =========================================================
#region --- Variables ==========================================================================================================================================
stop = False
player_finished_count = 0
list_players = [{'uuid' : '17105c4098cc4564b7a0da5f05c87a45'}]
game = None
#endregion


# =========================================================
#region --- Callback functions ==========================================================================================================================================
def callback_etappe(callObj):
    jsonObj = callObj.json_from_etappe()
    print(f'Etappe done - game callback! - {callObj}\njsonObj = {jsonObj}')


def callback_finish(callObj):
    global player_finished_count

    jsonObj = callObj.json_from_etappe_manager()
    print(f'Finished! - game callback! - {callObj}\njsonObj = {jsonObj}')

    player_finished_count += 1
    condition_stop()
#endregion


# =========================================================
#region --- Other functions ==========================================================================================================================================
def condition_stop():
    global stop
    global player_finished_count
    global list_players
    
    if (player_finished_count >= len(list_players)):
        stop = True

def reset_game():
    #clear variables for the game loop
    global stop
    global player_finished_count
    global game

    stop = False
    player_finished_count = 0
    game.clear_results()
#endregion


# =========================================================
#region --- RUN ==========================================================================================================================================
if __name__ == '__main__':
    game = GameManager()

    player_beacons = game.scan_for_players()
    for p in player_beacons:
        print(p)

    for i in range(0,3):
        reset_game()

        etappe_count = 3
        finish_width = 1.5
        game.initialize_game(
            etappe_count, 
            finish_width, 
            list_players, 
            callback_etappe, 
            callback_finish)

        time.sleep(1)
        game.start_game_loop()
        while stop == False:
            time.sleep(2)

        print(f'\n\n Scan results during the race: \n')
        #game.print_managers()
        game.stop_game_loop()
#endregion