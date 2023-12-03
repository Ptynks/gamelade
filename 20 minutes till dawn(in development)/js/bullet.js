class Bullet {
    constructor(x, y, damage) {
        this.rad = 3
        this.x = x
        this.y = y
        this.xSpeed = 14 // default 2.8
        this.ySpeed = 14 //default 2.2
        this.xDirection = 0
        this.yDirection = 0
        this.damage = damage
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
