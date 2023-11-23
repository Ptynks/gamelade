const WIDTH = 400
const HEIGHT = 400

function setup() {
    createCanvas(WIDTH, HEIGHT)
}

class Player {
    constructor() {
        this.x = WIDTH / 2
        this.y = HEIGHT / 2
        this.size = 20
        this.isMoving = false
    }
}

let player = new Player

function draw() {
    background('black')
    rectMode(CENTER)
    fill('white')
    square(player.x, player.y, player.size)
}

function keyPressed() {
    switch(keyCode) {
        case 87: {
            player.isMoving = true
            console.log(player.isMoving)
            playerMoveUp()
            break
        }
        
        case 68: {
            player.isMoving = true
            playerMoveRight()
            break
        }
        
        case 83: {
            player.isMoving = true
            playerMoveDown()
            break
        }

        case 65: {
            player.isMoving = true
            playerMoveLeft()
            break
        }
    }
}

function keyReleased() {
    player.isMoving = false
}

function playerMoveUp() {
    console.log(player.isMoving)
    do {
        player.y--
    }
    while (player.isMoving)
    console.log(player.isMoving)
}

function playerMoveRight() {
    do {
        player.x++
    }
    while (player.isMoving)
}

function playerMoveDown() {
    do {
        player.y++
    }
    while (player.isMoving)
}

function playerMoveLeft() {
    do {
        player.y++
    }
    while (player.isMoving)
}