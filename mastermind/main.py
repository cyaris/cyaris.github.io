from flask import Flask, request, render_template
from mastermind import Game, Level, Level1, Level2, Level3, GameMap

app = Flask(__name__)

@app.route('/')
def entry_page():
    return render_template('mastermind_flask.html')

# @app.route('/play/')
# def welcome():
#     return render_template('welcome.html')

# @app.route('/play/', methods=['GET', 'POST'])
# def player_input():
#     run_game = Game()
#     player_input = run_game.player_name()
#     print(player_input)
#     return render_template('welcome.html', message=player_input)

if __name__ == '__main__':
    app.run(debug=True)
