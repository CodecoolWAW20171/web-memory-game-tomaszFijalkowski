from flask import Flask, render_template, redirect, request, session, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/', methods=["POST"])
def start_game():
    x, y = request.form.values()
    return render_template('gameboard.html', x=x, y=y)


if __name__ == "__main__":
    app.secret_key = 'secret_key'
    app.run(
        debug=True,
        port=5000
    )
