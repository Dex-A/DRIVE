const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let distance = 0;
let speed = 2;
let isDriving = true;
let monsterProximity = 0;
let carPosition = canvas.width / 2;
let carSpeed = 0;
let roadCurvature = 0;
let trees = [];

const distanceDisplay = document.getElementById('distance');
const monsterWarning = document.getElementById('monster-warning');
const gameOverScreen = document.getElementById('game-over-screen');
const finalDistanceDisplay = document.getElementById('final-distance');

// Initialize tree positions
for (let i = 0; i < 20; i++) {
    trees.push({ x: Math.random() * canvas.width, y: i * 100 });
}

function drawRoad() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(carPosition - 150 + roadCurvature, 0, 300, canvas.height);
}

function drawCar() {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(carPosition - 15, canvas.height - 50, 30, 50);
}

function drawTrees() {
    ctx.fillStyle = '#228B22';
    trees.forEach(tree => {
        ctx.fillRect(tree.x, tree.y, 20, 60);
    });
}

function moveTrees() {
    trees.forEach(tree => {
        tree.y += speed;
        if (tree.y > canvas.height) {
            tree.y = -100;
            tree.x = Math.random() * canvas.width;
        }
    });
}

function updateRoad() {
    // Add random curves to the road
    if (Math.random() < 0.02) {
        roadCurvature += (Math.random() - 0.5) * 10;
    }

    carPosition += carSpeed;

    // Prevent car from going off-road
    if (carPosition < 50 || carPosition > canvas.width - 50) {
        carSpeed = 0;
        gameOver();
    }
}

function drive() {
    if (isDriving) {
        distance += speed;
        distanceDisplay.textContent = distance;

        // Increase speed over time
        if (distance % 1000 === 0 && speed < 15) {
            speed += 0.5;
        }

        // Move trees and update road
        moveTrees();
        updateRoad();

        // Monster proximity increases if you stop driving
        if (!isDriving) {
            monsterProximity += 2;
        } else {
            monsterProximity = Math.max(0, monsterProximity - speed / 2);
        }

        if (monsterProximity >= 100) {
            monsterWarning.style.display = 'block';
        } else {
            monsterWarning.style.display = 'none';
        }

        // Clear canvas and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRoad();
        drawTrees();
        drawCar();

        // Stop the game if monster catches you
        if (!isDriving && monsterProximity >= 100) {
            gameOver();
        }
    }
}

function gameOver() {
    isDriving = false;
    gameOverScreen.classList.remove('hidden');
    finalDistanceDisplay.textContent = `You drove: ${distance} miles`;
}

// Restart the game
function restartGame() {
    distance = 0;
    speed = 2;
    carPosition = canvas.width / 2;
    carSpeed = 0;
    roadCurvature = 0;
    monsterProximity = 0;
    isDriving = true;
    gameOverScreen.classList.add('hidden');
    gameLoop();
}

// Player controls for driving
document.body.onkeydown = function (e) {
    if (e.key === 'w') {
        isDriving = true;
    }
    if (e.key === 'a') {
        carSpeed = -3;
    }
    if (e.key === 'd') {
        carSpeed = 3;
    }
};

document.body.onkeyup = function (e) {
    if (e.key === 'a' || e.key === 'd') {
        carSpeed = 0;
    }
};

// Game loop
function gameLoop() {
    drive();
    requestAnimationFrame(gameLoop);
}

gameLoop();
