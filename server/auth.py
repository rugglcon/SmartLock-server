"""
This will do the main job of authenticating for logging in and
locks, locking and unlocking
"""

import query

CONN = query.Query("pi", "329db", "localhost", "smart_lock")

def authenticate(user, passwd):
    """
    selects a row that matches the given email and password,
    then returns the id if successfully authenticated. otherwise
    returns False
    """
    curs = CONN.select("id", "Users",
                       "email = '{}' and password = '{}'".format(user, passwd))
    if curs.rowcount == 0:
        return False
    return curs.fetchone()["id"]
