const icons = ['bomb', 'bug', 'bowling-ball'];
const btnStart = document.querySelector('.btn-start');
const gameOver = document.getElementById('gameOver');
const container = document.getElementById('container');
const box = document.querySelector('.box');
const base = document.querySelector('.base');
const scoreDash = document.querySelector('.score-dash');
const progressBar = document.querySelector('.progress-bar');
const boxCenter = [box.offsetLeft + (box.offsetWidth/2), box.offsetTop + (box.offsetHeight/2)];
const playerName = document.getElementById('playerName');
const scoreBoard = document.getElementById('scoreBoard');

let gamePlay = false;
let player;
let animateGame;

playerName.addEventListener('keyup', validateName);
btnStart.addEventListener('click', startGame);
container.addEventListener('mousedown', mouseDown);
container.addEventListener('mousemove', mousePosition);

function validateName(e) {
    const pln = e.target.value;
    if(pln !== '' && pln.length >= 3 && pln.length <= 20 ) {
        btnStart.disabled = false;
    } else {
        btnStart.disabled = true;
    }
}

function startGame() {
    gamePlay = true;
    gameOver.style.display = 'none';
    player = {
        score: 0,
        barwidth: 80,
        lives: 80
    }
    setupBadguys(12);
    animateGame = requestAnimationFrame(playGame);
}

function moveEnemy() {
    let hitter = false;
    let tempEnemy = document.querySelectorAll('.badguy');
    let tempShots = document.querySelectorAll('.fire-me');
    for (let enemy of tempEnemy) {
        if (enemy.offsetTop > 550 || enemy.offsetTop < 0 || enemy.offsetLeft > 750 || enemy.offsetLeft < 0) {
            enemy.parentNode.removeChild(enemy);
            badmaker();
        } else {
            enemy.style.top = enemy.offsetTop + enemy.movery + 'px';
            enemy.style.left = enemy.offsetLeft + enemy.moverx + 'px';
            for (let shot of tempShots) {
                if (isCollide(shot, enemy) && gamePlay) {
                    player.score += enemy.points;
                    enemy.parentNode.removeChild(enemy);
                    shot.parentNode.removeChild(shot);
                    updateDash();
                    badmaker();
                    break;
                }
            }
        }
        if (isCollide(box, enemy)) {
            hitter = true;
            player.lives--;
            if(player.lives < 0) {
                gameIsOver();
            }
        }
    }
    if (hitter) {
        base.style.backgroundColor = 'red';
        hitter = false;
    } else {
        base.style.backgroundColor = '';
    }
}

function gameIsOver() {
    cancelAnimationFrame(animateGame);
    gameOver.style.display = 'block';
    gameOver.querySelector('span').innerHTML = 'Game Over ' + playerName.value + '<br>Your Score: ' + player.score;
    gamePlay = false;
    let tempEnemy = document.querySelectorAll('.badguy');
    for (let enemy of tempEnemy) {
        enemy.parentNode.removeChild(enemy);
    }
    let tempShots = document.querySelectorAll('.fire-me');
    for (let shot of tempShots) {
        shot.parentNode.removeChild(shot);
    }

    const playerObj = {
        name: playerName.value,
        score: player.score
    }

    scoreBoard.innerHTML = "";
    addPlayerScores(playerObj);
}

function updateDash() {
    scoreDash.innerHTML = player.score;
    let tempPer = (player.lives / player.barwidth) * 100 + '%';
    progressBar.style.width = tempPer;
}

function degRad(deg) {
    return deg * (Math.PI / 180);
}

function mouseDown(e) {
    if(gamePlay) {
        let div = document.createElement('div');
        let deg = getDeg(e);

        div.setAttribute('class','fire-me');
        div.moverx = 5 * Math.sin(degRad(deg));
        div.movery = -5 * Math.cos(degRad(deg));
        div.style.left = (boxCenter[0]-5) + 'px';
        div.style.top = (boxCenter[1]-5) + 'px';
        div.style.width = 10 + 'px';
        div.style.height = 10 + 'px';
        container.appendChild(div);
    }
}

function mousePosition(e) {
    let deg = getDeg(e);
    box.style.transform = 'rotate('+deg+'deg)';
}

function getDeg(e) {
    let angle = Math.atan2(e.clientX - boxCenter[0], -(e.clientY - boxCenter[1]));
    return angle * (180 / Math.PI);
}

function isCollide(a,b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    )
}

function moveShots() {
    let tempShots = document.querySelectorAll('.fire-me');
    for (let shot of tempShots) {
        if(shot.offsetTop > 600 || shot.offsetTop < 0 || shot.offsetLeft > 800 || shot.offsetLeft < 0) {
            shot.parentNode.removeChild(shot);
        } else {
            shot.style.top = shot.offsetTop + shot.movery + 'px';
            shot.style.left = shot.offsetLeft + shot.moverx + 'px';
        }
    }
}

function setupBadguys(num) {
    for (let x=0; x<num; x++) {
        badmaker();
    }
}

function randomMe(num) {
    return Math.floor(Math.random()*num);
}

function badmaker() {
    let div = document.createElement('div');
    let myIcon = 'fa-' + icons[randomMe(icons.length)];
    let x, y, xmove, ymove;
    let randomStart = randomMe(4);
    let dirSet = randomMe(5)+1;
    let dirPos = randomMe(7)-3;

    switch(randomStart) {
        case 0:
            x = 0;
            y = randomMe(600);
            ymove = dirPos;
            xmove = dirSet;
            break;
        case 1:
            x = 800;
            y = randomMe(600);
            ymove = dirPos;
            xmove = dirSet *-1;
            break;
        case 2:
            x = randomMe(800);
            y = 0;
            ymove = dirSet;
            xmove = dirPos;
            break;
        case 3:
            x = randomMe(800);
            y = 600;
            ymove = dirSet *-1;
            xmove = dirPos;
            break;
    }

    div.innerHTML = '<i class="fas ' + myIcon + '"></i>';
    div.setAttribute('class', 'badguy');
    div.style.fontSize = randomMe(20) + 30 + 'px';
    div.style.color = 'rgb('+ randomMe(255) +','+ randomMe(255) +','+ randomMe(255) +')';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.points = randomMe(5) + 1;
    div.moverx = xmove;
    div.movery = ymove;
    container.appendChild(div);
}

function playGame() {
    if(gamePlay) {
        moveShots();
        updateDash();
        moveEnemy();
        animateGame = requestAnimationFrame(playGame);
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      getPlayerScores();
    }
  };
  
// Get players score
async function getPlayerScores() {
    const response = await fetch('http://localhost:3000/players');
    const resj = await response.json();
    // Sort by score
    const sortedResult = resj.sort( (a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));

    sortedResult.forEach(data => {
        scoreBoard.innerHTML += '<li>' + 'Name:' + '<strong>' + data.name + '</strong> ' + 'Score:' + '<strong>' + data.score + '</strong> ' + 'Date:' + formatDate(data.createdDate) + '</li>';
        console.log(data);
    })
    
}

// Add player score
async function addPlayerScores(data) {
    console.log(data);
    const url = 'http://localhost:3000/players';

    try {
        const response = await fetch(url, {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be `string` or {object}!
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        console.log('Success:', JSON.stringify(json));
      } catch (error) {
        console.error('Error:', error);
      }

    getPlayerScores();
    
}

function formatDate(date) {
    let formatedDate = new Date(date).toLocaleDateString();
    return formatedDate;
}