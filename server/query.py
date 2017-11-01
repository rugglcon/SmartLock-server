"""
query module so the main file doesn't
need to worry about the database except
for the data that goes in and out.
"""

import mysql.connector

CONN = mysql.connector.connect(user='pi', password='329db',
        host='localhost', database='smart_lock')

def select(selector, table, where=""):
    """
    function to retrieve data from tables
    returns all the rows from the select
    """
    cursor = CONN.cursor(buffered=True, dictionary=True)
    selection = "SELECT {} FROM {}".format(selector, table)
    if where != "":
        selection += " WHERE {}".format(where)
    cursor.execute(selection)
    return cursor
