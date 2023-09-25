var canvas = document.getElementById('Game');
var ctx = canvas.getContext('2d');
var width = 720;
var height = 480;
var p = new Player();
var b = new Ball();
var map = [];
var gravityAcc = 1;
var score = 0;
var highScore = 0;
var scoreTime = 0;
var scoreCoolDown = 30;

var leftPressed = false;
var rightPressed = false;
var jumpPressed = false;
var downPressed = false;
var shiftPressed = false;
var leftAttackPressed = false;
var rightAttackPressed = false;
var slowPressed = false;

//Event Listener Setup
document.addEventListener('keydown',keydownHandler,false);
document.addEventListener('keyup',keyupHandler,false);

//Keydown event handlers
function keydownHandler(e){
    if (e.keyCode == 65){
        leftPressed = true;
    }
    else if (e.keyCode == 68){
        rightPressed = true;
    }
    else if (e.keyCode == 87){
        jumpPressed = true;
    }
    else if (e.keyCode == 32){
        downPressed = true;
    }
    else if (e.keyCode == 16){
        shiftPressed = true;
    }
    else if (e.keyCode == 37){
        leftAttackPressed = true;
    }
    else if (e.keyCode == 39){
        rightAttackPressed = true;
    }
    else if (e.keyCode == 40){
        slowPressed = true;
    }
}

//Keyup event handlers
function keyupHandler(e){
    if (e.keyCode == 65){
        leftPressed = false;
    }
    else if (e.keyCode == 68){
        rightPressed = false;
    }
    else if (e.keyCode == 87){
        jumpPressed = false;
    }
    else if (e.keyCode == 32){
        downPressed = false;
    }
    else if (e.keyCode == 16){
        shiftPressed = false;
    }
    else if (e.keyCode == 37){
        leftAttackPressed = false;
    }
    else if (e.keyCode == 39){
        rightAttackPressed = false;
    }
    else if (e.keyCode == 40){
        slowPressed = false;
    }
}

//Movement key handler
function movementHandler(){
    //Horizontal Movement
    if (rightPressed && !leftPressed){
        p.updateHorzVel(1,shiftPressed);
    }
    else if (leftPressed && !rightPressed){
        p.updateHorzVel(-1,shiftPressed);
    }
    else {
        p.updateHorzVel(0,shiftPressed);
    }
    //Vertical Movement
    p.updateVertVel(jumpPressed,downPressed,gravityAcc);
    //Attack
    if (leftAttackPressed && !rightAttackPressed){
        p.attack(-1,b);
    }
    else if (rightAttackPressed && !leftAttackPressed){
        p.attack(1,b);
    }
    else {
        p.attack(0,b);
    }
    //Slow
    p.slow(slowPressed,b);
}

function updatePlayerPosition(){
    let xNew = p.xPos + p.xVel;
    let yNew = p.yPos + p.yVel;
    for (plat of map){
        [xNew,yNew] = plat.checkCollision(p,xNew,yNew);
    }
    p.xPos = xNew;
    p.yPos = yNew;
}

function updatePlayer(){
    movementHandler();
    updatePlayerPosition();
    p.bounds(width);
}

function updateBall(){
    b.updateVel(gravityAcc);
    b.updatePos();
    b.bounds(width,50);
}

function updateScore(){
    if (b.isHit){
        if (scoreTime > scoreCoolDown){
            score += 1;
        }
        b.isHit = false;
        scoreTime = 0;
    }
    else if (b.onGround){
        score = 0;
    }
    if (score > highScore){
        highScore = score;
    }
    scoreTime += 1;
}

function initializeMap(){
    let floor = new Map(0,50,width,50);
    map.push(floor);
    let platform = new Map(280,150,160,20);
    map.push(platform);
    let platform2 = new Map(100,250,160,20);
    map.push(platform2);
    let platform3 = new Map(460,250,160,20);
    map.push(platform3);
}

function draw(){
    ctx.beginPath();
    ctx.fillStyle = '#242424';
    ctx.fillRect(0,0,width,height);
    ctx.closePath()
    for (struct of map){
        struct.draw(ctx,height);
    }
    p.draw(ctx,height);
    b.draw(ctx,height);
    ctx.font = '44px Arial';
    ctx.fillStyle = '#cacccc';
    ctx.textAlign = 'center';
    ctx.fillText(score,600,60);
    ctx.fillText(highScore,120,60);
}

function update(){
    updatePlayer();
    updateBall();
    updateScore();
    draw();
    animationID = requestAnimationFrame(update);
}

initializeMap();
update();