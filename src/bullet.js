class Bullet
{
    #width;
    #height;
    #visualY;

    constructor(x, y, width, height)
    {
        this.#width = width;
        this.#height = height;
        this.x = x;
        this.y = y;
        this.moveIncrement = 15;
        this.isFired = false;
        this.bulletAngle = 0;
        this.offset = 0;
        this.#visualY = -this.height / 2;
        this.startTime = performance.now();
        this.hasDelay = false;
        this.delay = 0;
        this.endTime;
        this.spread = 0; // for the shotgun
    }

    get width()
    {
        return this.#width;
    }
    get height()
    {
        return this.#height;
    }

    set width(width)
    {
        throw new Error("Attempting to modify constant boundary width");
    }
    set height(height)
    {
        throw new Error("Attempting to modify constant boundary height");
    }

    draw()
    {
        if (this.isFired == false)
        {
            // save anything on the canvas before rotation
            context.save();
            // move player to make up for the rotation, so that player is in right spot
            context.translate(this.x, this.y);
            context.rotate(angle + this.spread);
            context.rotate(-Math.PI / 2);
            // draw player WITH rotation
            // negative width/height to make up for rotation and put player back to their center
            // -15 & +30 to move the bullet to the gun on the sprite visual
            context.fillRect((-this.width / 2) - 17, this.#visualY, this.width, this.height); // TODO: add offset to where bullet starts depending on the gun selected
            // restore the old canvas before rotation
            context.restore();

            // so bullet doesn't follow the mouse all the time
            this.isFired = true;
            this.bulletAngle = angle + this.spread;

            if (player.weapon != "shotgun")
            {
                player.setCurrentAmmo(player.getCurrentAmmo() - 1);
            }
        }
        else
        {
            context.save();
            context.translate(player.x, player.y);
            context.rotate(this.bulletAngle);
            context.rotate(-Math.PI / 2);
            context.fillRect((-this.width / 2) - 17, this.#visualY, this.width, this.height);
            context.restore();
        }

        this.#visualY = this.#visualY + this.moveIncrement;

        this.x = this.x + (Math.cos(this.bulletAngle) * this.moveIncrement);
        this.y = this.y + (Math.sin(this.bulletAngle) * this.moveIncrement);
    }

    checkZombieCollision()
    {
        for (let i = 0; i < zombies.length; i++)
        {
            const zombie = zombies[i];
            let touching = zombie.y + zombie.height >= this.y &&
                            zombie.y <= this.y + this.height &&
                            zombie.x + zombie.width >= this.x && 
                            zombie.x <= this.x + this.width;
            
            if (touching)
            {   
                zombies[i].hp = zombies[i].hp - (player.damage + player.damageModifier);
            }
        }
    }

    checkBoundaryCollision()
    {
        for (let i = 0; i < boundaryBlocks.length; i++)
        {   
            // bullet only stops if touching wall
            if (boundaryBlocks[i].color == "red")
            {
                continue;
            }

            const boundary = boundaryBlocks[i];
            let touching = boundary.y + boundary.height >= this.y &&
                            boundary.y <= this.y + this.height &&
                            boundary.x + boundary.width >= this.x && 
                            boundary.x <= this.x + this.width;

            if (touching)
            {
                console.log("BULLET TOUCH")
                //console.log("this x " + this.x + " this y " + this.y)
                return true;
            }
        }

        return false;
    }

    checkOutOfBounds()
    {
        if (this.y <= 0 || this.y >= 4096 || this.x >= 4096 || this.x <= 0)
        {
            console.log("OUT OF BOUNDS")
            return true;
        }

        return false;
    }
}

var bullets = [];

function generateBullets()
{
    let bulletX = player.x + (Math.cos(angle + 1.5) * player.width / 5);
    let bulletY = player.y + (Math.sin(angle + 1.5) * player.height / 5);

    if (player.weapon != "rifle" && player.weapon != "shotgun")
    {
        bullets.push(new Bullet(bulletX, bulletY, 5, 10));
    }
    else if (player.weapon == "shotgun")
    {
        let bullet1 = new Bullet(bulletX, bulletY, 5, 10);
        let bullet2 = new Bullet(bulletX, bulletY, 5, 10);
        bullet2.spread = -0.25;
        let bullet3 = new Bullet(bulletX, bulletY, 5, 10);
        bullet3.spread = 0.25;

        bullets.push(bullet1);
        bullets.push(bullet2);
        bullets.push(bullet3);

        player.setCurrentAmmo(player.getCurrentAmmo() - 1);
    }   
    else // rifle = burst shots
    {
        let bullet1 = new Bullet(bulletX, bulletY, 5, 10);
        let bullet2 = new Bullet(bulletX, bulletY, 5, 10);
        bullet2.hasDelay = true;
        bullet2.delay = 0.2;
        let bullet3 = new Bullet(bulletX, bulletY, 5, 10);
        bullet3.hasDelay = true;
        bullet3.delay = 0.4;

        bullets.push(bullet1);
        bullets.push(bullet2);
        bullets.push(bullet3);
    }
}