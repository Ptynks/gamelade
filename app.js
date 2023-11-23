// dashboards 
const dashboards = document.querySelector("#dashboards")
let dashboardsArray = {
    'screenWidth': '',
    'screenHeight': '',
    'playerX': '',
    'playerY': '',
    'playerSize': '',
    'playerSpeed': '',
    'bulletX': '',
    'bulletY': '',
    'bulletSize': '',
    'bulletSpeed': '',
    'bulletDirection': '',
    'mouseX': '',
    'mouseY': '',
    'keyPressing': ''
}
//

const WIDTH = 400 //set canvas width
dashboardsArray['screenWidth'] = WIDTH //for display to dashboard 
const HEIGHT = 400 //set canvas height
dashboardsArray['screenHeight'] = HEIGHT //for display to dashboard 

function setup() {
    createCanvas(WIDTH, HEIGHT)
    frameRate(30);
    ellipseMode(RADIUS);
}

class Player {
    constructor() {
        this.x = WIDTH / 2
        this.y = HEIGHT / 2
        this.size = 20
        this.acceleration = 0
        this.speed = 5
    }
}

class Bullet {
    constructor(x, y) {
        this.rad = 10
        this.x = x
        this.y = y
        this.xSpeed = 7.8 // default 2.8
        this.ySpeed = 7.2 //default 2.2
        this.xDirection = 0
        this.yDirection = 0
    }
}

let player = new Player
let bullet = new Bullet(WIDTH / 2, HEIGHT / 2)

function moveObject() {
    document.addEventListener("keydown", (e) => {dashboardsArray['keyPressing'] = e.key})
    document.addEventListener("keyup", () => {dashboardsArray['keyPressing'] = ""})

    // Nếu nhấn nút W hoặc phím mũi tên lên, giảm y
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        player.y -= player.speed;
    }
    // Nếu nhấn nút A hoặc phím mũi tên trái, giảm x
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        player.x -= player.speed;
    }
    // Nếu nhấn nút S hoặc phím mũi tên xuống, tăng y
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        player.y += player.speed;
    }
    // Nếu nhấn nút D hoặc phím mũi tên phải, tăng x
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        player.x += player.speed;
    }
    // Giới hạn vị trí của đối tượng trong khung hình
    player.x = constrain(player.x, 0 + (player.size / 2), WIDTH - (player.size / 2));
    player.y = constrain(player.y, 0 + (player.size / 2), HEIGHT - (player.size / 2));
}

function draw() {
    background('black')

    //draw player
    rectMode(CENTER)
    fill('white')
    square(player.x, player.y, player.size)

    //draw bullet
    bullet.x = bullet.x + bullet.xSpeed * bullet.xDirection
    bullet.y = bullet.y + bullet.ySpeed * bullet.yDirection

    if (bullet.x > WIDTH - bullet.rad || bullet.x < bullet.rad) {
        bullet.xDirection *= -1
    }
    if (bullet.y > HEIGHT - bullet.rad || bullet.y < bullet.rad) {
        bullet.yDirection *= -1
    }

    ellipse(bullet.x, bullet.y, bullet.rad, bullet.rad)

    moveObject()

    dashboardsArray['playerX'] = player.x.toFixed(2)
    dashboardsArray['playerY'] = player.y.toFixed(2)
    dashboardsArray['playerSize'] = player.size
    dashboardsArray['playerSpeed'] = player.speed
    dashboardsArray['bulletX'] = bullet.x.toFixed(2)
    dashboardsArray['bulletY'] = bullet.y.toFixed(2)
    dashboardsArray['bulletSize'] = bullet.rad
    dashboardsArray['bulletSpeed'] = `${bullet.xSpeed} | ${bullet.ySpeed} | ${((bullet.xSpeed + bullet.ySpeed) / 2).toFixed(2)}`
    dashboardsArray['bulletDirection'] = `${bullet.xDirection} | ${bullet.yDirection} | ${((bullet.xDirection + bullet.yDirection) / 2).toFixed(2)}`
    dashboardsArray['mouseX'] = mouseX.toFixed(2)
    dashboardsArray['mouseY'] = mouseY.toFixed(2)
    dashboardRefresh()
}

function mousePressed() {
    let dx = mouseX - bullet.x
    let dy = mouseY - bullet.y

    let d = sqrt(dx * dx + dy * dy)

    let ux = dx / d
    let uy = dy / d

    bullet.xDirection = ux
    bullet.yDirection = uy
}

var keys = Object.keys(dashboardsArray)
// update dashboards
function dashboardRefresh() {
    dashboards.innerHTML = ""
    for (let i = 0; i < keys.length; i++) {
        var li = document.createElement('li')
        li.innerHTML = `${keys[i]}: ${dashboardsArray[keys[i]]} `
        dashboards.appendChild(li)
    }
}
//