var PLAY = 1;
var END = 0;
var gameState = PLAY;
var playerImg, deadImg;
var pathImg, path;
var coinPoints = 0;
var player;
var invisibleBoundary1, invisibleBoundary2;
var coin, coinImg, coinsGroup;
var spikeImg, spike, spikeGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var coinSound, dieSound;

function preload(){
    playerImg = loadAnimation("player.png");
    pathImg = loadImage("path.png");
    coinImg = loadImage("coin.png");
    spikeImg = loadImage("spike.png");
    deadImg = loadAnimation("dead.png");
    gameOverImg = loadImage("game_over.png");
    restartImg = loadImage("reset_btn.png");

    coinSound = loadSound("coinSound.wav");
    dieSound = loadSound("died.wav");
}

function setup() {
    createCanvas(600,600);
    path = createSprite(300,300);
    path.addImage(pathImg);
    path.velocityY = 4;
    path.scale = 1.2;

    player = createSprite(300,530,20,50);
    player.addAnimation("player", playerImg);
    //player.addAnimation("dead", deadImg);
    player.scale = 0.2;

    invisibleBoundary1 = createSprite(460,340,10,500);
    invisibleBoundary1.visible = false;

    invisibleBoundary2 = createSprite(142,340,10,500);
    invisibleBoundary2.visible = false;

    gameOver = createSprite(300,230);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5
  
    restart = createSprite(300,360);
    restart.addImage(restartImg);
    restart.scale = 0.2

    coinsGroup = new Group();
    spikeGroup = new Group();
}

function draw() {
    background(0);

    if (gameState === PLAY) { 
        gameOver.visible = false;
        restart.visible = false;
        
        path.velocityY = (4 + 3* coinPoints/100)

        if(path.y > 400){
            path.y = height/2;
        }

        if (keyDown("LEFT_ARROW")) {
            player.velocityX = -4;
        }

        if (keyDown("RIGHT_ARROW") ) {
            player.velocityX = 4;
        }

        player.collide(invisibleBoundary1);
        player.collide(invisibleBoundary2);

        spawnCoins();
        spawnSpikes();

        if (coinsGroup.isTouching(player)) {
            for (var i = 0; i < coinsGroup.length; i++) {
                if (coinsGroup[i].isTouching(player)) {
                  coinsGroup[i].destroy();
                  coinPoints = coinPoints + 10;
                  coinSound.play();
                }
            }
        }

        if (spikeGroup.isTouching(player)) {
            gameState = END;
            player.velocityX = 0;
            dieSound.play();
        }
    }

    else if (gameState === END) {
        player.addAnimation("player", deadImg);

        path.velocityY = 0;
        player.velocityX = 0;
        
        spikeGroup.setLifetimeEach(-1);
        coinsGroup.setLifetimeEach(-1);
        
        spikeGroup.setVelocityYEach(0);
        coinsGroup.setVelocityYEach(0);

        gameOver.visible = true;
        restart.visible = true;
    }

    if(mousePressedOver(restart)) {
        reset();
    }

    textSize(20);
    fill("white");
    text("Points: "+ coinPoints,30,30);
    
    drawSprites();
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    player.changeAnimation("player", playerImg);
    coinPoints = 0;
    spikeGroup.destroyEach();
    coinsGroup.destroyEach();
}

function spawnCoins() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
      coin = createSprite(300,120,40,10);
      coin.x = Math.round(random(142,460));
      coin.addImage(coinImg);
      coin.scale = 0.1;
      coin.velocityY = 4;
      coin.lifetime = 400;
      
      coin.depth = player.depth;
      player.depth = player.depth + 1;
      
      coinsGroup.add(coin);
    }
}

function spawnSpikes() {
    if (frameCount % 120 === 0) {
        spike = createSprite(300,120,40,10);
        spike.x = Math.round(random(142,460));
        spike.addImage(spikeImg);
        spike.scale = 0.1;
        spike.velocityY = 4;
        spike.lifetime = 200;

        spike.depth = player.depth;
        player.depth = player.depth + 1;

        spikeGroup.add(spike);
    }
}