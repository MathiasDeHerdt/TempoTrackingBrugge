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

    # beacon
    @staticmethod
    def read_game():
        sql = "SELECT * FROM gametbl"
        return Database.get_rows(sql)

    @staticmethod
    def insert_game(player, etappe, group, date):
        sql = "INSERT INTO gametbl(GroupName, PlayerCount, EttapeCount, Date) VALUES (%s, %s, %s, %s)"
        param = [group, player, etappe, date]
        return Database.execute_sql(sql, param)
