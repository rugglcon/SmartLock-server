"""
This will do the main job of authenticating for logging in and
locks, locking and unlocking
"""

import query
import time

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

def use_lock(user_id, lock_id, op):
    """
    checks whether the given ID can activate
    the given lock
    """
    curs = CONN.select("lock_id", "access",
                       "user_id = '{}'".format(user_id))

    if curs.rowcount == 0:
        return False
    for row in curs:
        if row["lock_id"] == lock_id:
            CONN.insert("ops", "user_id, lock_id, time, op",
                        "{}, {}, {}, {}".format(
                            user_id, lock_id, time.time(), op))
            CONN.gen_query("""insert into locks columns (state)
                            values ({}) where id = '{}'""".format(
                                op * -1, lock_id))
    return True
