from Repository.database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()

        else:
            gegevens = request.form.to_dict()

        return gegeven

    def read_team():
        sql = "SELECT * FROM teamtbl"
        return Database.get_rows(sql)

    def read_beacon():
        sql = "SELECT * FROM beacontbl"
        return Database.get_rows(sql)
