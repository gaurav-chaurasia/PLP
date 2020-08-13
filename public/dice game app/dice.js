var scores, active_player, round_score, player_name, game_status;

restart();

function next_player() {
    active_player === 0 ? active_player = 1 : active_player = 0;
    round_score = 0;

    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;

    document.querySelector('.player-0-panel').classList.toggle('inactive');
    document.querySelector('.player-1-panel').classList.toggle('inactive');
    document.querySelector('.btn-new').classList.toggle('btn-new-toggle');
    document.querySelector('.btn-roll').classList.toggle('btn-roll-toggle');
    document.querySelector('.btn-hold').classList.toggle('btn-hold-toggle');
    document.querySelector('.dice').classList.toggle('dice-toggle');
    document.querySelector('.dice').style.display = 'none';
}

document.querySelector('.player-name').addEventListener('click', function () {
    player_name = [
        prompt("Pleas enter your name "),  // askng plears for there name
        prompt("Pleas enter your name ")
    ];

    document.getElementById('name-0').innerHTML = player_name[0] ? player_name[0] : "Player 1";
    document.getElementById('name-1').innerHTML = player_name[1] ? player_name[1] : "Player 2";
});

function restart() {
    /*
    whenever game restart set everything to start
    */
    game_status = true;
    scores = [0, 0];
    round_score = 0;
    player_name = ['', ''];
    active_player = 0;
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
    document.getElementById('name-0').textContent = 'player 1';
    document.getElementById('name-1').textContent = 'player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('inactive');
    document.querySelector('.player-1-panel').classList.remove('inactive');
    document.querySelector('.player-1-panel').classList.add('inactive');
    document.querySelector('.btn-new').classList.remove('btn-new-toggle');
    document.querySelector('.btn-roll').classList.remove('btn-roll-toggle');
    document.querySelector('.btn-hold').classList.remove('btn-hold-toggle');
    document.querySelector('.dice').classList.remove('dice-toggle');
}

document.querySelector('.btn-new').addEventListener('click', restart);

document.querySelector('.btn-roll').addEventListener('click', function () {
    if (game_status) {
        var dice_number = Math.floor(Math.random() * 6) + 1;
        var dice = document.querySelector('.dice');


        dice.style.display = 'block';
        dice.src = 'img/dice-' + dice_number + '.png';

        if (dice_number !== 1) {
            round_score += dice_number;
            document.querySelector('#current-' + active_player).textContent = round_score;
        } else {
            next_player();
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (game_status) {
        scores[active_player] += round_score;

        document.querySelector('#score-' + active_player).textContent = scores[active_player];

        if (scores[active_player] >= 100) {
            var name_obj = document.querySelector('#name-' + active_player);
            name_obj.textContent = player_name[active_player] ? player_name[active_player] + ' is Winner!' : "Winner!";
            document.querySelector('.player-' + active_player + '-panel').classList.add('winner');
            game_status = false;
        } else {
            next_player();
        }
    }
});