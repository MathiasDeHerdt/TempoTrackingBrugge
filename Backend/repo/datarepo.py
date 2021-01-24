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

    # =========================================================
    # Inserts
    # =========================================================

    @staticmethod
    def insert_game(player, etappe, group, date):
        sql = "INSERT INTO gametbl(GroupName, PlayerCount, EttapeCount, Date) VALUES (%s, %s, %s, %s)"
        params = [group, player, etappe, date]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_player(playername, teamname):
        sql = "INSERT INTO playertbl (PlayerName, TeamName) VALUES (%s, %s)"
        params = [playername, teamname]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_beacon(major, minor, uuid, adres, txPower):
        sql = "INSERT INTO beacontbl (Major, Minor, UUID, Address, Tx_power) VALUES (%s, %s, %s, %s, %s)"
        params = [major, minor, uuid, adres, txPower]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_result(totalTime, avgSpeed):
        sql = "INSERT INTO resulttbl (TotalTime, AvgSpeed) VALUES (%s, %s)"
        params = [totalTime, avgSpeed]
        return Database.execute_sql(sql, params)

    @staticmethod
    def insert_etappe(timePerEtappe, speedPerEtappe):
        sql = "INSERT INTO etappetbl (TimePerEtap, SpeedPerEtap) VALUES (%s, %s)"
        params = [timePerEtappe, speedPerEtappe]
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
    def update_player(playerName, teamName, beaconID):
        sql = "UPDATE playertbl SET PlayerName=%s, TeamName=%s WHERE BeaconID=%s"
        params = [playerName, teamName, beaconID]
        return Database.execute_sql(sql, params)

    @staticmethod
    def update_result(TotalTime, AvgSpeed, PlayerID):
        sql = "UPDATE resulttbl SET TotalTime=%s, AvgSpeed=%s WHERE PlayerID=%s"
        params = [TotalTime, AvgSpeed, PlayerID]
        return Database.execute_sql(sql, params)
