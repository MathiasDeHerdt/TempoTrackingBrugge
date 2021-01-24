from .database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()

        else:
            gegevens = request.form.to_dict()

        return gegevens

    # =========================================================
    # Reads
    # =========================================================

    @staticmethod
    def read_game():
        sql = "SELECT * FROM gametbl"
        return Database.get_rows(sql)

    @staticmethod
    def read_game_by_date(date):
        sql = "SELECT * FROM gametbl WHERE Date=%s"
        params = [date]
        return Database.get_one_row(sql, params)

    @staticmethod
    def read_player():
        sql = "SELECT * FROM playertbl"
        return Database.get_rows(sql)

    @staticmethod
    def read_result():
        sql = "SELECT * FROM resulttbl"
        return Database.get_rows(sql)

    @staticmethod
    def read_beacon():
        sql = "SELECT * FROM beacontbl"
        return Database.get_rows(sql)

    @staticmethod
    def read_beacon_by_uuid(uuid):
        sql = "SELECT * FROM beacontbl WHERE UUID=%s"
        params = [uuid]
        return Database.get_one_row(sql, params)

    @staticmethod
    def read_etappe():
        sql = "SELECT * FROM etappetbl"
        return Database.get_rows(sql)

    @staticmethod
    def read_leaderboard(etappe):
        sql = "SELECT p.PlayerName, p.TeamName, g.GroupName, r.TotalTime FROM playertbl as p INNER JOIN resulttbl as r ON r.PlayerID = p.PlayerID INNER JOIN gametbl as g ON p.GameID = g.GameID WHERE g.EtappeCount = %s ORDER BY r.TotalTime ASC;"
        params = [etappe]
        return Database.get_rows(sql, params)

    @staticmethod
    def read_player_result():
        sql = "SELECT P.PlayerName, P.TeamName, R.TotalTime, R.AvgSpeed FROM playertbl P, resulttbl R WHERE P.PlayerID = R.PlayerID ORDER BY R.TotalTime ASC"
        return Database.get_rows(sql)

    @staticmethod
    def read_player_by_game(gameID):
        sql = "SELECT * FROM playertbl WHERE GameID=%s"
        params = [gameID]
        return Database.get_rows(sql, params)

    # =========================================================
    # Inserts
    # =========================================================

    @staticmethod
    def insert_game(player, etappe, group, date):
        sql = "INSERT INTO gametbl(GroupName, PlayerCount, EtappeCount, Date) VALUES (%s, %s, %s, %s)"
        params = [group, player, etappe, date]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_player(playername, teamname, beaconId, gameId):
        sql = "INSERT INTO playertbl (PlayerName, TeamName, BeaconId, GameId) VALUES (%s, %s, %s, %s)"
        params = [playername, teamname, beaconId, gameId]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_beacon(major, minor, uuid, adres, txPower):
        sql = "INSERT INTO beacontbl (Major, Minor, UUID, Address, Tx_power) VALUES (%s, %s, %s, %s, %s)"
        params = [major, minor, uuid, adres, txPower]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_result(totalTime, avgSpeed, playerID):
        sql = "INSERT INTO resulttbl (TotalTime, AvgSpeed, PlayerID) VALUES (%s, %s, %s)"
        params = [totalTime, avgSpeed, playerID]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_etappe(timePerEtappe, speedPerEtappe, playerID):
        sql = "INSERT INTO etappetbl (TimePerEtap, SpeedPerEtap, PlayerID) VALUES (%s, %s, %s)"
        params = [timePerEtappe, speedPerEtappe, playerID]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_leaderboard(playerName, teamName, groupName, totalTime):
        sql = "INSERT INTO leaderboardtbl(PlayerName, TeamName, GroupName, TotalTime) VALUES (%s, %s, %s, %s)"
        params = [playerName, teamName, groupName, totalTime]
        return Database.execute_sql(sql, params)

    # =========================================================
    # Updates
    # =========================================================
    @staticmethod
    def update_beacon(major, minor, uuid, adres, txPower, beaconID):
        sql = "UPDATE beacontbl SET Major=%s, Minor=%s, UUID=%s, Address=%s, Tx_power=%s WHERE BeaconID = %s;"
        params = [major, minor, uuid, adres, txPower, beaconID]
        return Database.execute_sql(sql, params)

    @staticmethod
    def update_beacon_by_uuid(major, minor, uuid, adres, txPower):
        sql = "UPDATE beacontbl SET Major=%s, Minor=%s, Address=%s, Tx_power=%s WHERE UUID=%s;"
        params = [major, minor, adres, txPower, uuid]
        return Database.execute_sql(sql, params)

    @staticmethod
    def update_player(playerName, teamName, beaconID):
        sql = "UPDATE playertbl SET PlayerName=%s, TeamName=%s WHERE BeaconID=%s"
        params = [playerName, teamName, beaconID]
        return Database.execute_sql(sql, params)

    @staticmethod
    def update_result(TotalTime, AvgSpeed, PlayerID):
        sql = "UPDATE resulttbl SET TotalTime=%s, AvgSpeed=%s WHERE PlayerID=%s"
        params = [TotalTime, AvgSpeed, PlayerID]
        return Database.execute_sql(sql, params)
