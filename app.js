const startBtn = document.querySelector("#startBtn")
const startMenu = document.querySelector("#startMenu")
const restartBtn = document.querySelector("#restartBtn")
const gameOver = document.querySelector("#gameOver")
const returnBtn = document.querySelector("#returnBtn")
const skillMenu = document.querySelector("#skillMenu")

let isGameOver = false
let isGameStarted = false
let isPause = false

const WIDTH = 500 //set canvas width
const HEIGHT = 500 //set canvas height 

function setup() {
    createCanvas(WIDTH, HEIGHT)
    frameRate(30)
    ellipseMode(RADIUS)
    imageMode(CENTER)
    rectMode(CENTER)
    textFont('monospace')
    textSize(13)
    fill('white')
    textAlign(LEFT)
}

var bullets = []
var enemys = []

let player = new Player(WIDTH / 2, HEIGHT / 2)

startBtn.addEventListener("click", () => {
    isGameStarted = true
    isGameOver = false
    startMenu.style.display = "none"
})

restartBtn.addEventListener("click", () => {
    isGameOver = false
    isGameStarted = true
    resetGame()
    gameOver.style.display = "none"
})

returnBtn.addEventListener("click", () => {
    isGameStarted = false
    isGameOver = false
    resetGame()
    gameOver.style.display = "none"
    startMenu.style.display = "block"
})

function hideMenu() {
    skillMenu.style.display = "none"
    isPause = false
    document.querySelector("canvas").style.cursor = "none"
}

function resetGame() {
    player.x = WIDTH / 2
    player.y = HEIGHT / 2
    player.point = 0
    player.health = player.maxHealth
    player.level = 0
    player.reloadBullet = player.maxBullet
    player.isReloaded = false
    player.pointToLevelUp = 100

    bulletDamagePlus = 0

    enemys = []
    bullets = []
}

let timeEnemySpawn = 0
let coolDownSpawn = 200
let expText = []

function draw() {
    if(!isGameStarted) {

    } else if (isGameStarted && !isGameOver && !isPause) {
        //clear screen
        background('black')

        //on pause 
        if(keyIsDown(80)) {
            isPause = true
        }

        //draw player
        rectMode(CENTER)
        fill('white')
        player.draw()
        player.movement()
        player.levelUp()

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
                if (collideSquareCircle(enemy.x, enemy.y, enemy.size, element.x, element.y, element.rad)) {
                    enemy.health -= (element.damage + bulletDamagePlus)

                    if(enemy.health <= 0) {
                        enemyIndexToDelete = enemyIndex
                        player.point += enemy.point
                        expText.unshift(enemy.point)
                    }
                    indexToDelete = index
                }
            })
        })

        if (indexToDelete !== -1) {
            bullets.splice(indexToDelete, 1)
            indexToDelete = -1
        }

        enemys.forEach((enemy, index) => {
            enemy.x = enemy.x + enemy.xSpeed * enemy.xDirection
            enemy.y = enemy.y + enemy.ySpeed * enemy.yDirection
            enemy.draw()

            enemy.moveToPlayer(player.x, player.y)
            
            //player hurt
            if (collideRectRect(enemy.x, enemy.y, enemy.size, enemy.size, player.x, player.y, player.size, player.size)) {
                enemyIndexToDelete = index

                player.health -= 1
                
                if(player.health <= 0) {
                    isGameOver = true
                }
            }
        })

        //enemy dead
        if (enemyIndexToDelete !== -1) {
            player.point += 1

            fill('yellow')

            ellipse(enemys[enemyIndexToDelete].x, enemys[enemyIndexToDelete].y, enemys[enemyIndexToDelete].size, enemys[enemyIndexToDelete].size)
            enemys.splice(enemyIndexToDelete, 1)
            enemyIndexToDelete = -1
        }

        //draw enemy
        timeEnemySpawn += 1

        if (timeEnemySpawn >= coolDownSpawn) {
            timeEnemySpawn = random(0, 200)
            if(coolDownSpawn > 100) {
                coolDownSpawn -= 2
            }
            let spawnX = random(20, WIDTH - 20)
            let spawnY = random(20, HEIGHT - 20)
            let point = Math.floor(random(10, 50))
            var enemy = new Enemy(spawnX, spawnY, point)

            //enemy warning spawn
            ellipse(spawnX, spawnY, 10, 10)
            
            setTimeout(() => {
                enemys.push(enemy)
            }, 600)
        }

        //draw crosshair
        drawCrosshair()

        expText.forEach((point) => {
            fill('white')
            text("+" + point, player.x + 15, player.y - 15)
            setTimeout(() => {
                expText.shift()
            }, 500)
        })

        if(player.reloadBullet <= 0 && !player.isReloaded) {
            player.isReloaded = true
            setTimeout(() => {
                player.reloadBullet = player.maxBullet
                player.isReloaded = false
            }, player.reloadTime)
        }

        // ui draw
        fill("white")
        textAlign(LEFT)
        textSize(13)
        text("health: " + player.health, 10, 20)
        text("level: " + player.level, 10, HEIGHT - 30)
        rect(0, HEIGHT - 10, player.point * WIDTH / 100, 20)
        // for(let i = 0; i < player.reloadBullet; i++) {
        //     ellipse(WIDTH - 20 * (i + 2), 20, 5, 5)
        // }
        textAlign(RIGHT)
        textSize(10)
        text(player.reloadBullet, player.x + 20, player.y + 20)

        if(player.isReloaded) {
            fill('white')
            textAlign(CENTER)
            textSize(8)
            text("reload...", player.x, player.y - 20)
        }
    } else if (isGameOver) {
        document.querySelector("#gameOver").style.display = "block"
    } else if(isPause) {
        document.querySelector("canvas").style.cursor = "pointer"
        if(keyIsDown(80)) {
            isPause = false
        }
    }
}

function mousePressed() {
    if(player.reloadBullet > 0) {
        player.reloadBullet -= 1
        bullets.push(new Bullet(player.x, player.y))
    } 
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
    return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

// Hàm nhận biết va chạm giữa hình vuông và hình tròn
function collideSquareCircle(squareX, squareY, squareSize, circleX, circleY, circleRadius) {
    // Tìm góc gần nhất của hình vuông với tâm của hình tròn
    let closestX = constrain(circleX, squareX, squareX + squareSize)
    let closestY = constrain(circleY, squareY, squareY + squareSize)

    // Tính khoảng cách giữa góc gần nhất và tâm của hình tròn
    let dist = distance(circleX, circleY, closestX, closestY)

    // Nếu khoảng cách nhỏ hơn hoặc bằng bán kính của hình tròn, trả về true
    if (dist <= circleRadius) {
        return true
    }

    // Ngược lại, trả về false
    return false
}

function collideRectRect(x, y, w, h, x2, y2, w2, h2) {
    //2d
    //add in a thing to detect rectMode CENTER
    if (x + w >= x2 &&    // r1 right edge past r2 left
        x <= x2 + w2 &&    // r1 left edge past r2 right
        y + h >= y2 &&    // r1 top edge past r2 bottom
        y <= y2 + h2) {    // r1 bottom edge past r2 top
        return true
    }
    return false
}