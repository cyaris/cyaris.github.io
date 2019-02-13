from flask import Flask, request, render_template
from mastermind import Level, Level1, Level2, Level3, GameMap

app = Flask(__name__)

@app.route('/')
def entry_page():
    return render_template('welcome.html')

@app.route('/', methods=['GET', 'POST'])
def play_game(level):
    return render_template('play.html', message=level)

# @app.route('/', methods=['GET', 'POST'])
# def forward_message():
#     level_message = "hi"
#     return render_template('play.html', message=level_message)

# @app.route('/', methods=['GET', 'POST'])
# def player_input():
#     run_game = Game()
#     player_input = run_game.player_name()
#     print(player_input)
#     return render_template('play.html', message=player_input)

if __name__ == '__main__':
    app.run(debug=True)
