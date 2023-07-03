from flask import Flask,render_template,redirect
import os
import sqlite3

currentLocation = os.path.dirname(os.path.abspath(__file__))
myapp=Flask(__name__)

@myapp.route("/")
def homepage():
    return render_template("homepage.html")

@myapp.route("/",method=["POST"])
def checklogin():
    UN = request.form['Username']
    PW = request.form['Password']
    sqlconnection = sqlite3.Connection(currentlocation = "\login.db")
    cursor = sqlconnection.cursor()
    query1 = "select username,password from login where username={un} AND password={pw}".format(un=UN, pw=PW)
    rows = cursor.execute(query1)
    rows = rows.fetchall()
    if len(rows) == 1:
        return render_template("logged.html")
    else:
        return render_template("register.html")

if __name__ == "__main__":
    myapp.run()
