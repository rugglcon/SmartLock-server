"""
This will do the main job of authenticating for logging in and
locks, locking and unlocking
"""

import query

CONN = query.Query("pi", "329db", "localhost", "smart_lock")

def authenticate(user, passwd):
    """
    selects a row that matches the given email and password
    """
    curs = CONN.select("*", "Users",
                       "email = {} and password = {}".format(user, passwd))
    if curs.rowcount == 0:
        return False
    return True
