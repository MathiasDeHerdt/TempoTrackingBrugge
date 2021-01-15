from mysql import connector  # pip install mysql-connector-python
import os


class Database:
    # 1. connectie openen met classe variabelen voor hergebruik
    @staticmethod
    def __open_connection():
        try:
            print("in de try")

            configFile = "../configdb.py"
            print(configFile)

            db = connector.connect(option_files=os.path.abspath(os.path.join(
                os.path.dirname(__file__), configFile)), autocommit=False)

            print("====================")
            print(db)
            print("====================")
            print("na inlezen configdb")

            if "AttributeError" in(str(type(db))):
                raise Exception("foutieve database parameters in config")

            cursor = db.cursor(dictionary=True, buffered=True)

            print("net voor de return")
            return db, cursor

        except connector.Error as err:
            if err.errno == connector.errorcode.ER_ACCESS_DENIED_ERROR:
                print("\nACCES DENIED!\n")

            elif err.errno == connector.errorcode.ER_BAD_DB_ERROR:
                print("\nDATABASE NOT FOUND\n")

            else:
                print(err)

            return

    # 2. Executes READS
    @staticmethod
    def get_rows(sqlQuery, params=None):
        result = None
        db, cursor = Database.__open_connection()
        try:
            cursor.execute(sqlQuery, params)
            result = cursor.fetchall()
            cursor.close()

            if (result is None):
                print(ValueError(f"Resultaten zijn onbestaand.[DB Error]"))
            db.close()

        except Exception as error:
            print(error)  # development boodschap
            result = None

        finally:
            return result

    @staticmethod
    def get_one_row(sqlQuery, params=None):
        db, cursor = Database.__open_connection()
        try:
            cursor.execute(sqlQuery, params)
            result = cursor.fetchone()
            cursor.close()

            if (result is None):
                raise ValueError("Resultaten zijn onbestaand.[DB Error]")

        except Exception as error:
            print(error)  # development boodschap
            result = None

        finally:
            db.close()
            return result

    # 3. Executes INSERT, UPDATE, DELETE with PARAMETERS
    @staticmethod
    def execute_sql(sqlQuery, params=None):
        result = None
        db, cursor = Database.__open_connection()
        try:
            cursor.execute(sqlQuery, params)
            db.commit()
            result = cursor.lastrowid
            if result != 0:
                result = result

            else:
                if cursor.rowcount == -1:
                    raise Exception("Fout in SQL")

                elif cursor.rowcount == 0:
                    result = 0

                elif result == "undefined":
                    raise Exception("SQL error")
                else:
                    result = cursor.rowcount

        except connector.Error as error:
            db.rollback()
            result = None
            print(f"Error: Data niet bewaard.{error.msg}")

        finally:
            cursor.close()
            db.close()
            return result
