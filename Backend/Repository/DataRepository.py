from Repository.database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()

        else:
            gegevens = request.form.to_dict()

        return gegeven

    # =========================================================
    # Reads
    # =========================================================

    # beacon
    def read_beacon():
        sql = "SELECT * FROM beacontbl"
        return Database.get_rows(sql)

    # player
    def read_player():
        sql = "SELECT * FROM playertbl"
        return Database.get_rows(sql)

    # result
    def read_result():
        sql = "SELECT * FROM resulttbl"
        return Database.get_rows(sql)

    # beacon - player
    def read_beacon_player():
        sql = "SELECT beacon.BeaconID, beacon.Data, beacon.BluetoothAddress, player.PlayerID, player.PlayerName, player.TeamName from beacontbl as beacon join playertbl as player on beacon.BeaconID = player.PlayerID;"
        return Database.get_rows(sql)

    # player - result
    def read_player_result():
        sql = "SELECT player.PlayerID, player.PlayerName, player.TeamName , result.Date, result.Time from playertbl as player join resulttbl as result on player.PlayerID = result.ResultID;"
        return Database.get_rows(sql)

    # beacon - player - result
    def read_all_tables():
        sql = "SELECT * FROM beacontbl as beacon, playertbl as player, resulttbl as result WHERE beacon.BeaconID = player.PlayerID and player.PlayerID = result.ResultID;"
        return Database.get_rows(sql)
