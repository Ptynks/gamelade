class Player {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 20
        this.speed = 5
        this.point = 0
        this.maxHealth = 3
        this.health = this.maxHealth
        this.maxBullet = 5
        this.reloadBullet = this.maxBullet
        this.isReloaded = false
        this.reloadTime = 1000
        this.level = 0
        this.pointToLevelUp = 100
        this.isAiming = false
        this.aimPower = 0
        this.maxAimPower = 30
        this.maxDamagePivot = this.maxAimPower * 0.7
        this.damage = 5
    }

    draw() {
        square(this.x, this.y, this.size)
        this.drawAim()
    }

    drawAim() {
        if(this.isAiming) {
            rectMode(CENTER)
            rect(this.x, this.y - 15, this.size + 10, 3)
            if(this.aimPower >= this.maxDamagePivot) {
                fill("green")
            } else {
                fill("yellow")
            }
            rect(this.x, this.y - 15, this.aimPower, 5)
        }
    }

    movement() {
        // Nếu nhấn nút W hoặc phím mũi tên lên, giảm y
        if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
            this.y -= this.speed;
        }
        // Nếu nhấn nút A hoặc phím mũi tên trái, giảm x
        if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
            this.x -= this.speed;
        }
        // Nếu nhấn nút S hoặc phím mũi tên xuống, tăng y
        if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
            this.y += this.speed;
        }
        // Nếu nhấn nút D hoặc phím mũi tên phải, tăng x
        if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
            this.x += this.speed;
        }
        // Giới hạn vị trí của đối tượng trong khung hình
        this.x = constrain(this.x, 0 + (this.size / 2), WIDTH - (this.size / 2));
        this.y = constrain(this.y, 0 + (this.size / 2), HEIGHT - (this.size / 2));
    }

    levelUp() {
        if(this.point >= this.pointToLevelUp) {
            this.level += 1
            this.point = this.point - this.pointToLevelUp
            this.pointToLevelUp += 20

            isPause = true

            document.querySelector("#skillMenu").style.display = "block"

            let skillSlot = []
            for(let i = 0; i < 3; i++) {
                skillSlot.push(skills[Math.floor(Math.random() * skills.length)])
            }

            document.querySelector("#skill_name_1").innerHTML = skillSlot[0][0]
            document.querySelector("#skill_name_2").innerHTML = skillSlot[1][0]
            document.querySelector("#skill_name_3").innerHTML = skillSlot[2][0]

            document.querySelector("#skill_des_1").innerHTML = skillSlot[0][1]
            document.querySelector("#skill_des_2").innerHTML = skillSlot[1][1]
            document.querySelector("#skill_des_3").innerHTML = skillSlot[2][1]

            document.querySelector("#skill_img_1").src = skillSlot[0][2]
            document.querySelector("#skill_img_2").src = skillSlot[1][2]
            document.querySelector("#skill_img_3").src = skillSlot[2][2]
        }
    }
}