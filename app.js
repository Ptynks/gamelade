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
//-----------

const WIDTH = 400 //set canvas width
dashboardsArray['screenWidth'] = WIDTH //for display to dashboard 
const HEIGHT = 400 //set canvas height
dashboardsArray['screenHeight'] = HEIGHT //for display to dashboard 

function setup() {
    createCanvas(WIDTH, HEIGHT)
    frameRate(30);
    ellipseMode(RADIUS);
    imageMode(CENTER)
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
        this.rad = 3
        this.x = x
        this.y = y
        this.xSpeed = 10 // default 2.8
        this.ySpeed = 10 //default 2.2
        this.xDirection = 0
        this.yDirection = 0
        this.spawn()
    }

    draw() {
        ellipse(this.x, this.y, this.rad, this.rad)
    }

    spawn() {
        this.x = player.x
        this.y = player.y

        let dx = mouseX - this.x
        let dy = mouseY - this.y

        let d = sqrt(dx * dx + dy * dy)

        let ux = dx / d
        let uy = dy / d

        this.xDirection = ux
        this.yDirection = uy
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 20
    }

    draw() {
        fill('red')
        rect(this.x, this.y, this.size, this.size)
    }
}

var bullets = []
var enemys = []

let player = new Player

function moveObject() {
    document.addEventListener("keydown", (e) => { dashboardsArray['keyPressing'] = e.key })
    document.addEventListener("keyup", () => { dashboardsArray['keyPressing'] = "" })

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

let timeEnemySpawn = 0
let coolDownSpawn = 300

function draw() {
    background('black')

    //draw player
    rectMode(CENTER)
    fill('white')
    square(player.x, player.y, player.size)
    moveObject()

    //draw bullet
    var indexToDelete = -1;
    var enemyIndexToDelete = -1

    bullets.forEach((element, index) => {
        element.x = element.x + element.xSpeed * element.xDirection
        element.y = element.y + element.ySpeed * element.yDirection
        element.draw()

        if (element.x > WIDTH - element.rad || element.x < element.rad) {
            // this.xDirection *= -1
            indexToDelete = index
        }
        if (element.y > HEIGHT - element.rad || element.y < element.rad) {
            // this.yDirection *= -1
            indexToDelete = index
        }

        //check collision ennemy and bullet
        enemys.forEach((enemy, enemyIndex) => {
            if(collideSquareCircle(enemy.x, enemy.y, enemy.size, element.x, element.y, element.rad)) {
                enemyIndexToDelete = enemyIndex
            }
        })
    })

    if (indexToDelete !== -1) {
        bullets.splice(indexToDelete, 1)
        indexToDelete = -1
    }

    if (enemyIndexToDelete !== -1) {
        enemys.splice(enemyIndexToDelete, 1)
        enemyIndexToDelete = -1
    }

    //draw enemy
    timeEnemySpawn += 1

    if (timeEnemySpawn === coolDownSpawn) {
        timeEnemySpawn = 0
        var enemy = new Enemy(random(20, WIDTH - 20), random(20, HEIGHT - 20))
        enemys.push(enemy)
    }

    enemys.forEach((element) => {
        element.draw()
    })

    //draw crosshair
    drawCrosshair()


    dashboardsArray['playerX'] = (player.x).toFixed(2)
    dashboardsArray['playerY'] = (player.y).toFixed(2)
    dashboardsArray['playerSize'] = player.size
    dashboardsArray['playerSpeed'] = player.speed
    // dashboardsArray['bulletX'] = (bullet.x).toFixed(2)
    // dashboardsArray['bulletY'] = (bullet.y).toFixed(2)
    // dashboardsArray['bulletSize'] = bullet.rad
    // dashboardsArray['bulletSpeed'] = `${bullet.xSpeed} | ${bullet.ySpeed} | ${((bullet.xSpeed + bullet.ySpeed) / 2).toFixed(2)}`
    // dashboardsArray['bulletDirection'] = `${bullet.xDirection} | ${bullet.yDirection} | ${((bullet.xDirection + bullet.yDirection) / 2).toFixed(2)}`
    dashboardsArray['mouseX'] = mouseX.toFixed(2)
    dashboardsArray['mouseY'] = mouseY.toFixed(2)
    dashboardRefresh()
}

function mousePressed() {
    bullets.push(new Bullet(player.x, player.y))
}

function drawCrosshair() {
    push()
    translate(mouseX, mouseY)
    rotate(45)
    fill('white')
    ellipseMode(CENTER)
    rectMode(CENTER)
    ellipse(0, 0, 4, 4)
    rect(0, -20, 5, 15)
    rect(0, 20, 5, 15)
    rect(-20, 0, 15, 5)
    rect(20, 0, 15, 5)
    pop()
}

// Hàm tính khoảng cách giữa hai điểm
function distance(x1, y1, x2, y2) {
    return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// Hàm nhận biết va chạm giữa hình vuông và hình tròn
function collideSquareCircle(squareX, squareY, squareSize, circleX, circleY, circleRadius) {
    // Tìm góc gần nhất của hình vuông với tâm của hình tròn
    let closestX = constrain(circleX, squareX, squareX + squareSize);
    let closestY = constrain(circleY, squareY, squareY + squareSize);

    // Tính khoảng cách giữa góc gần nhất và tâm của hình tròn
    let dist = distance(circleX, circleY, closestX, closestY);

    // Nếu khoảng cách nhỏ hơn hoặc bằng bán kính của hình tròn, trả về true
    if (dist <= circleRadius) {
        return true;
    }

    // Ngược lại, trả về false
    return false;
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