class Enemy {
    constructor(x, y, point) {
        this.x = x
        this.y = y
        this.size = 20
        this.speed = (Math.random() + 1) * 3
        this.xSpeed = this.speed
        this.ySpeed = this.speed
        this.xDirection = 0
        this.yDirection = 0
        this.point = point
        this.health = 10
    }

    draw() {
        fill('red')
        rect(this.x, this.y, this.size, this.size)
    }

    moveToPlayer(x, y) {
        let dx = x - this.x
        let dy = y - this.y

        let d = sqrt(dx * dx + dy * dy)

        let ux = dx / d
        let uy = dy / d

        this.xDirection = ux
        this.yDirection = uy
    }
}