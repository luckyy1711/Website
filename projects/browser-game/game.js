
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const message = document.getElementById("gameMessage");
const startButton = document.getElementById("startButton");
const year = document.getElementById("year");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

let player = null;
let enemies = [];
let score = 0;
let highScore = 0;
let gameRunning = false;
let keys = {};

let enemyTimer = 0;
let lastTime = 0;
let swipeX = null;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    if (player) {
        player.y = canvas.height - 55;
    }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "a" ||
        key === "d"
    ) {
        event.preventDefault();
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

function startGame() {
    score = 0;
    enemies = [];
    enemyTimer = 0;

    player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 55,
        width: 30,
        height: 30,
        speed: 7
    };

    scoreDisplay.textContent = "0";
    gameRunning = true;
    message.style.display = "none";

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}

function createEnemy() {
    const size = 22 + Math.random() * 18;

    enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: 7 + Math.random() * 6 + score / 35
    });
}

function update(delta) {
    if (!player) {
        return;
    }

    if (keys["arrowleft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        player.x += player.speed;
    }

    player.x = Math.max(
        0,
        Math.min(canvas.width - player.width, player.x)
    );

    enemyTimer += delta;

    const spawnDelay = Math.max(120, 650 - score * 6);

    if (enemyTimer > spawnDelay) {
        createEnemy();
        enemyTimer = 0;
    }

    enemies.forEach(function(enemy) {
        enemy.y += enemy.speed;
    });

    for (const enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            endGame();
            return;
        }
    }

    enemies = enemies.filter(function(enemy) {
        return enemy.y < canvas.height + enemy.height;
    });

    score += delta / 1000;
    scoreDisplay.textContent = Math.floor(score);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!player) {
        return;
    }

    ctx.fillStyle = "#00aaff";
    ctx.shadowColor = "#00aaff";
    ctx.shadowBlur = 20;

    ctx.beginPath();

    ctx.moveTo(
        player.x + player.width / 2,
        player.y
    );

    ctx.lineTo(
        player.x + player.width,
        player.y + player.height
    );

    ctx.lineTo(
        player.x,
        player.y + player.height
    );

    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";

    enemies.forEach(function(enemy) {
        ctx.fillStyle = "#ffffff";

        ctx.save();

        ctx.translate(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2
        );

        ctx.rotate(Math.PI / 4);

        ctx.fillRect(
            -enemy.width / 2,
            -enemy.height / 2,
            enemy.width,
            enemy.height
        );

        ctx.restore();
    });
}

function gameLoop(time) {
    if (!gameRunning) {
        return;
    }

    const delta = time - lastTime;
    lastTime = time;

    update(delta);
    draw();

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

function endGame() {
    gameRunning = false;

    const finalScore = Math.floor(score);

    if (finalScore > highScore) {
        highScore = finalScore;
    }

    highScoreDisplay.textContent = highScore;

    message.innerHTML =
        "<h2>GAME OVER</h2>" +
        "<p>Score: " + finalScore + "</p>" +
        '<button id="restartButton">PLAY AGAIN</button>';

    message.style.display = "flex";

    document
        .getElementById("restartButton")
        .addEventListener("click", startGame);
}

function pressLeft(event) {
    event.preventDefault();
    keys["arrowleft"] = true;
}

function releaseLeft(event) {
    event.preventDefault();
    keys["arrowleft"] = false;
}

function pressRight(event) {
    event.preventDefault();
    keys["arrowright"] = true;
}

function releaseRight(event) {
    event.preventDefault();
    keys["arrowright"] = false;
}

leftButton.addEventListener("pointerdown", pressLeft);
leftButton.addEventListener("pointerup", releaseLeft);
leftButton.addEventListener("pointercancel", releaseLeft);
leftButton.addEventListener("pointerleave", releaseLeft);

rightButton.addEventListener("pointerdown", pressRight);
rightButton.addEventListener("pointerup", releaseRight);
rightButton.addEventListener("pointercancel", releaseRight);
rightButton.addEventListener("pointerleave", releaseRight);

canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();

    if (event.touches.length === 1) {
        swipeX = event.touches[0].clientX;
    }
}, { passive: false });

canvas.addEventListener("touchmove", function(event) {
    event.preventDefault();

    if (swipeX === null || event.touches.length !== 1) {
        return;
    }

    const currentX = event.touches[0].clientX;
    const difference = currentX - swipeX;

    if (difference < -5) {
        keys["arrowleft"] = true;
        keys["arrowright"] = false;
    }

    if (difference > 5) {
        keys["arrowright"] = true;
        keys["arrowleft"] = false;
    }

    swipeX = currentX;
}, { passive: false });

canvas.addEventListener("touchend", function(event) {
    event.preventDefault();

    swipeX = null;
    keys["arrowleft"] = false;
    keys["arrowright"] = false;
}, { passive: false });

startButton.addEventListener("click", startGame);

year.textContent = new Date().getFullYear();
