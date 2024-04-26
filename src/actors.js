class arrowPathBox
{
    #width; 
    #height;

    constructor(x, y, width, height, direction)
    {
        this.x = x;
        this.y = y;
        this.#width = width;
        this.#height = height;
        this.direction = direction;
        this.oppositeDirection = "";
        this.currentImg = null;
        this.angle = 0; // up direction is 0 degrees
        this.angleInRadians = 0;
        this.partOfPath = false;

        switch(this.direction)
        {
            case "up":
                this.angle = 0;
                this.angleInRadians = 0;
                this.oppositeDirection = "down";
                break;
            case "right":
                this.angle = 90;
                this.angleInRadians = Math.PI / 2;
                this.oppositeDirection = "left";
                break;
            case "left":
                this.angle = 270;
                this.angleInRadians = Math.PI + (Math.PI / 2);
                this.oppositeDirection = "right";
                break;
            case "down":
                this.angle = 180;
                this.angleInRadians = Math.PI;
                this.oppositeDirection = "up";
                break;
        }
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
        throw new Error("Attempting to modify constant hitbox width");
    }
    set height(height)
    {
        throw new Error("Attempting to modify constant hitbox height");
    }

    rotate()
    {
        this.angle = this.angle + 90;

        switch(this.angle)
        {
            case 0:
                this.angleInRadians = 0;
                this.direction = "up";
                this.oppositeDirection = "down";
                break;
            case 90:
                this.angleInRadians = Math.PI / 2;
                this.direction = "right";
                this.oppositeDirection = "left";
                break;
            case 180:
                this.angleInRadians = Math.PI;
                this.direction = "down";
                this.oppositeDirection = "up";
                break;
            case 270:
                this.angleInRadians = Math.PI + (Math.PI / 2);
                this.direction = "left";
                this.oppositeDirection = "right";
                break;
            case 360:
                this.angle = 0;
                this.direction = "up";
                this.oppositeDirection = "down";
                break;
        }
    }

    draw()
    {   
        switch(this.angle)
        {
            case 0:
                if (!this.partOfPath)
                {
                    context.drawImage(arrowUpImg, this.x, this.y, this.width, this.height);
                }
                else
                {
                    context.drawImage(arrowUpImgCircle, this.x, this.y, this.width, this.height);
                }
                this.direction = "up";
                break;
            case 90:
                if (!this.partOfPath)
                {
                    context.drawImage(arrowRightImg, this.x, this.y, this.width, this.height);
                }
                else
                {
                    context.drawImage(arrowRightImgCircle, this.x, this.y, this.width, this.height);
                }
                this.direction = "right";
                break;
            case 180:
                if (!this.partOfPath)
                {
                    context.drawImage(arrowDownImg, this.x, this.y, this.width, this.height);
                }
                else
                {
                    context.drawImage(arrowDownImgCircle, this.x, this.y, this.width, this.height);
                }
                this.direction = "down";
                break;
            case 270:
                if (!this.partOfPath)
                {
                    context.drawImage(arrowLeftImg, this.x, this.y, this.width, this.height);
                }
                else
                {
                    context.drawImage(arrowLeftImgCircle, this.x, this.y, this.width, this.height);
                }
                this.direction = "left";
                break;
        }
    }

    update(entity, offset, gap, xOffset, yOffset)
    {
        // keeps rotation in place
        this.x = entity.x - offset + xOffset;
        this.y = entity.y - entity.height - offset + gap + yOffset;
    }
}


function bulletsOffset(offset)
{
    for (let i = 0; i < bullets.length; i++)
    {
        bullets[i].offset = offset;
    }
}

let moveMap = new Map();
moveMap.set('w', false);
moveMap.set('a', false);
moveMap.set('s', false);
moveMap.set('d', false); 

function moveBoundaries(movement = {x: 0, y: 0})
{
    boundaryBlocks.forEach(boundary =>
    {
        boundary.x = boundary.x + movement.x;
        boundary.y = boundary.y + movement.y;
    }) 
}

/*--------------------------PLAYER----------------------PLAYER------------------PLAYER---------------------------------*/

class Player // PNG = 289 x 224 pixels
{
    #width; // private variables indicated by #
    #height;

    constructor (x, y, pWidth, pHeight, hp, weapon)
    {
        this.x = x;
        this.y = y;
        // x-pixel length of image
        this.#width = pWidth; 
        // y-pixel length of image
        this.#height = pHeight; 
        this.hitbox = new spriteHitBox(this.x, this.y, this.width / 1.6, this.height / 1.6);
        this.hp = 100;
        this.weapon = weapon;
        this.ammoCapacity = 0;
        this.money = 0;
        this.isReloading = false;
        this.reloadTime = 0;
        this.damage = 0;
        this.pistolAmmo = 0;
        this.rifleAmmo = 0;
        this.shotgunAmmo = 0;
        this.heldPistolAmmo = 0;
        this.heldRifleAmmo = 0;
        this.heldShotgunAmmo = 0;
        // so that the first shot doesn't get delayed in the mousedown logic
        // and so that the delay works properly as for example, each burst from a shotgun can appear and disappear at the same time
        // meaning the delay could get less
        this.firstShot = false; 
        this.riflePurchased = false;
        this.shotgunPurchased = false;
        this.damageModifier = 0;
        this.speed = 3;
        this.inventory = ["pistol"];
        this.maximumHealth = 100;

        switch(this.weapon)
        {
            case "pistol":
                this.pistolAmmo = 15;
                this.reloadTime = 2;
                this.ammoCapacity = 15;
                this.heldPistolAmmo = 15;
                this.damage = 10;
                break;
            case "rifle":
                this.rifleAmmo = 30;
                this.reloadTime = 3;
                this.ammoCapacity = 30;
                this.heldRifleAmmo = 30;
                this.damage = 15;
                break;
            case "shotgun":
                this.shotgunAmmo = 6;
                this.reloadTime = 6;
                this.ammoCapacity = 6;
                this.heldShotgunAmmo = 6;
                this.damage = 30;
                break;
        }

    }

    getCurrentAmmo()
    {
        switch(this.weapon)
        {
            case "pistol":
                return this.pistolAmmo;
            case "rifle":
                return this.rifleAmmo;
            case "shotgun":
                return this.shotgunAmmo;
        }
    }

    getHeldAmmo()
    {
        switch(this.weapon)
        {
            case "pistol":
                return this.heldPistolAmmo;
            case "rifle":
                return this.heldRifleAmmo;
            case "shotgun":
                return this.heldShotgunAmmo;
        }
    }

    setCurrentAmmo(ammo)
    {
        switch(this.weapon)
        {
            case "pistol":
                this.pistolAmmo = ammo;
                break;
            case "rifle":
                this.rifleAmmo = ammo;
                break;
            case "shotgun":
                this.shotgunAmmo = ammo;
                break;
        }
    }

    setHeldAmmo(ammo)
    {
        switch(this.weapon)
        {
            case "pistol":
                this.heldPistolAmmo = ammo;
                break;
            case "rifle":
                this.heldRifleAmmo = ammo;
                break;
            case "shotgun":
                this.heldShotgunAmmo = ammo;
                break;
        }
    }

    updateAmmoCount()
    {
        let difference = 0;

        switch(this.weapon)
        {
            case "pistol":
                difference = this.ammoCapacity - this.pistolAmmo;
                if (this.heldPistolAmmo - difference > 0)
                {
                    this.pistolAmmo = this.pistolAmmo + difference;
                    this.heldPistolAmmo = this.heldPistolAmmo - difference;
                }
                else 
                {
                    // not enough stored bullets to fill magazine
                    this.pistolAmmo = this.pistolAmmo + this.heldPistolAmmo;
                    this.heldPistolAmmo = 0;
                }
                break;
            case "rifle":
                difference = this.ammoCapacity - this.rifleAmmo;
                if (this.heldRifleAmmo - difference > 0)
                {
                    this.rifleAmmo = this.rifleAmmo + difference;
                    this.heldRifleAmmo = this.heldRifleAmmo - difference;
                }
                else 
                {
                    // not enough stored bullets to fill magazine
                    this.rifleAmmo = this.rifleAmmo + this.heldRifleAmmo;
                    this.heldRifleAmmo = 0;
                }
                break;
            case "shotgun":
                difference = this.ammoCapacity - this.shotgunAmmo;
                if (this.heldShotgunAmmo - difference > 0)
                {
                    this.shotgunAmmo = this.shotgunAmmo + difference;
                    this.heldShotgunAmmo = this.heldShotgunAmmo - difference;
                }
                else 
                {
                    // not enough stored bullets to fill magazine
                    this.shotgunAmmo = this.shotgunAmmo + this.heldShotgunAmmo;
                    this.heldShotgunAmmo = 0;
                }
                break;
        }
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
        throw new Error("Attempting to modify constant player width");
    }
    set height(height)
    {
        throw new Error("Attempting to modify constant player height");
    }

    draw()
    {
        let imageToDraw = null;

        switch(this.weapon)
        {
            case "knife":
                imageToDraw = knifeImg;
                break;
            case "pistol":
                imageToDraw = handgunImg;
                break;
            case "rifle":
                imageToDraw = rifleImg;
                break;
            case "shotgun":
                imageToDraw = shotgunImg;
                break;
        }

        // save anything on the canvas before rotation
        context.save();
        // move player to make up for the rotation, so that player is in right spot
        context.translate(this.x, this.y);
        context.rotate(angle);
        // draw player WITH rotation
        // negative width/height to make up for rotation and put player back to their center
        context.drawImage(imageToDraw, -this.width / 2, -this.height / 2, this.width, this.height);
        // restore the old canvas before rotation
        context.restore();
    }

    move() // MUST BE POSITIVE
    {
        // why?????
        let speed = this.speed;

        moveMap.forEach(function(value, key)
        {
            if (value == true)
            {
                if (key == 'w')
                {
                    if (!checkCollisionList({x: 0, y: speed}, boundaryBlocks, player.hitbox))
                    {
                        // player stays still
                        // background moves "around" the player
                        background.y = background.y + speed;
                        moveBoundaries({x: 0, y: speed});
                        bulletsOffset(3);

                        for (let i = 0; i < zombies.length; i++)
                        {
                            for (let j = 0; j < zombies[i].pathToFollow.length; j++)
                            {
                                zombies[i].pathToFollow[j].y = zombies[i].pathToFollow[j].y + speed
                            }

                            zombies[i].y = zombies[i].y + speed;
                            zombies[i].hitbox.y = zombies[i].hitbox.y + speed; 
                        }

                        for (let i = 0; i < spawnBlocks.length; i++)
                        {
                            spawnBlocks[i].y = spawnBlocks[i].y + speed
                        }

                        for (let i = 0; i < upgrades.length; i++)
                        {
                            upgrades[i].y = upgrades[i].y + speed;
                        }
                    }
                }
                else if (key == 'a')
                {
                    if (!checkCollisionList({x: speed, y: 0}, boundaryBlocks, player.hitbox))
                    {
                        background.x = background.x + speed;
                        moveBoundaries({x: speed, y: 0});
                        bulletsOffset(3);

                        for (let i = 0; i < zombies.length; i++)
                        {
                            for (let j = 0; j < zombies[i].pathToFollow.length; j++)
                            {
                                zombies[i].pathToFollow[j].x = zombies[i].pathToFollow[j].x + speed
                            }

                            zombies[i].x = zombies[i].x + speed;
                            zombies[i].hitbox.x = zombies[i].hitbox.x + speed; 
                        }

                        for (let i = 0; i < spawnBlocks.length; i++)
                        {
                            spawnBlocks[i].x = spawnBlocks[i].x + speed
                        }

                        for (let i = 0; i < upgrades.length; i++)
                        {
                            upgrades[i].x = upgrades[i].x + speed;
                        }
                    }
                }
                else if (key == 's')
                {
                    if (!checkCollisionList({x: 0, y: -speed}, boundaryBlocks, player.hitbox))
                    {
                        background.y = background.y - speed;
                        moveBoundaries({x: 0, y: -speed});
                        bulletsOffset(-3);

                        for (let i = 0; i < zombies.length; i++)
                        {
                            for (let j = 0; j < zombies[i].pathToFollow.length; j++)
                            {
                                zombies[i].pathToFollow[j].y = zombies[i].pathToFollow[j].y - speed
                            }

                            zombies[i].y = zombies[i].y - speed;
                            zombies[i].hitbox.y = zombies[i].hitbox.y - speed; 
                        }

                        for (let i = 0; i < spawnBlocks.length; i++)
                        {
                            spawnBlocks[i].y = spawnBlocks[i].y - speed
                        }

                        for (let i = 0; i < upgrades.length; i++)
                        {
                            upgrades[i].y = upgrades[i].y - speed;
                        }
                    }
                }
                else if (key == 'd')
                {
                    if (!checkCollisionList({x: -speed, y: 0}, boundaryBlocks, player.hitbox))
                    {
                        background.x = background.x - speed;
                        moveBoundaries({x: -speed, y: 0});
                        bulletsOffset(-3);

                        for (let i = 0; i < zombies.length; i++)
                        {
                            for (let j = 0; j < zombies[i].pathToFollow.length; j++)
                            {
                                zombies[i].pathToFollow[j].x = zombies[i].pathToFollow[j].x - speed
                            }

                            zombies[i].x = zombies[i].x - speed;
                            zombies[i].hitbox.x = zombies[i].hitbox.x - speed; 
                        }

                        for (let i = 0; i < spawnBlocks.length; i++)
                        {
                            spawnBlocks[i].x = spawnBlocks[i].x - speed
                        }

                        for (let i = 0; i < upgrades.length; i++)
                        {
                            upgrades[i].x = upgrades[i].x - speed;
                        }
                    }
                }
            }
        })
    }
}

// randomly chosen x and y values to look like the middle
var player = new Player(700, 350, 70, 70, 100, "pistol");

/*----------------------------ZOMBIE----------------------ZOMBIE------------------ZOMBIE----------------------------------*/

class Zombie // PNG = 289 x 224 pixels
{
    #width; // private variables indicated by #
    #height;
    #zombieToPlayerAngle;
    #currentBox;

    constructor (x, y, pWidth, pHeight, hp, speed)
    {
        this.x = x;
        this.y = y;
        // x-pixel length of image
        this.#width = pWidth; 
        // y-pixel length of image
        this.#height = pHeight; 
        this.hitbox = new spriteHitBox(this.x, this.y, this.width / 1.6, this.height / 1.6);
        this.pathList = [];
        this.#zombieToPlayerAngle = 0;
        this.#currentBox = 0;
        this.pathToFollow = [];
        this.hp = hp;
        this.speed = speed;
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
        throw new Error("Attempting to modify constant player width");
    }
    set height(height)
    {
        throw new Error("Attempting to modify constant player height");
    }

    // move the arrow boxes to their correct position
    #updateCorrectly(originalBox, arrowBox)
    {
        switch (arrowBox.direction)
        {
            case "up":
                // why 0.000001??? it just works
                // to prevent overlaps
                // can be larger like 1, but make it super small value so that gap between
                // arrow boxes aren't noticable
                arrowBox.update(originalBox, 0, 0, 0, -0.000001); 
                break;
            case "left":
                arrowBox.update(originalBox, 0, 0, -44, 44);
                break;
            case "right":
                arrowBox.update(originalBox, 0, 0, 44, 44);
                break;
            case "down":
                arrowBox.update(originalBox, 0, 0, 0, 88);
                break;
        }
    }

    #startingDirection()
    {
        let xPlayerOffset = player.x - this.x;
        let yPlayerOffset = player.y - this.y;
        let zombieAngle = Math.atan2(yPlayerOffset, xPlayerOffset);

        let positiveAngle = (zombieAngle + Math.PI + Math.PI) * (180/Math.PI);

        if (positiveAngle > 360)
        {
            positiveAngle = positiveAngle - 360;
        }

        if (positiveAngle >= 0 && positiveAngle < 90)
        {   
            return "right";
        }
        else if (positiveAngle >= 90 && positiveAngle < 180)
        {   
            return "down";
        }
        else if (positiveAngle >= 180 && positiveAngle < 185) // diagonal left-up to accomodate for pathfinding, otherwise will go diagonal without using the up arrow and only the left arrow
        {   
            return "left";
        }
        else 
        {
            return "up";
        }    
    }

    // create pathfinding map
    pathfind()
    {
        let xPlayerOffset = player.x - this.x;
        let yPlayerOffset = player.y - this.y;
        this.#zombieToPlayerAngle = Math.atan2(yPlayerOffset, xPlayerOffset);
        let distance = 999999999999999;

        let positiveAngle = (this.#zombieToPlayerAngle + Math.PI + Math.PI) * (180/Math.PI);

        let tempPath = null;

        if (positiveAngle > 360)
        {
            positiveAngle = positiveAngle - 360;
        }

        this.pathToFollow = [];
        this.pathList = [];

        if (this.pathList.length == 0)
        {
            let startingPath = new arrowPathBox(this.x, this.y, this.width / 1.6, this.height / 1.6, this.#startingDirection());
            startingPath.update(this, (this.width / 2) / 1.6, 25 + (this.width / 1.6), 0, 0);
            this.pathList.push(startingPath);
        }

        let touchPlayer = false;
        let stopAt = null; // the arrow box that touches the player
        
        for (let i = 0; !touchPlayer && i < 600 && i < this.pathList.length; i++) // TODO: Check if player nowhere to be found - stop if hit the whole map and hasn't found player
        {
            for (let j = 0; j < 4; j++)
            {
                let newPath = new arrowPathBox(this.pathList[i].x, this.pathList[i].y, this.width / 1.6, this.height / 1.6, "up");
                for (let g = j; g > 0; g--)
                {
                    newPath.rotate();
                }
                this.#updateCorrectly(this.pathList[i], newPath);

                // if the player is below the zombie, no need to check above the zombie
                if (positiveAngle > 0 && positiveAngle < 180) // go down
                {
                    if (newPath.y < this.pathList[0].y)
                    {
                        continue;
                    }   
                }
                else if ((positiveAngle > 0 && positiveAngle < 90) || (positiveAngle >= 270 && positiveAngle <= 360)) // go right
                {
                    if (newPath.x < this.pathList[0].x)
                    {
                        continue;
                    }   
                }
                else if (positiveAngle > 90 && positiveAngle < 270) // go left
                {
                    if (newPath.x > this.pathList[0].x)
                    {
                        continue;
                    }   
                }
                else if (positiveAngle > 180 && positiveAngle < 360) // go up
                {
                    if (newPath.y > this.pathList[0].y)
                    {
                        continue;
                    }   
                }

                // check for overlapping arrow boxes
                if (!checkCollisionList({x: 0, y: 0}, this.pathList, newPath))
                {
                    // check if any arrow boxes touch walls or objects
                    if (!checkCollisionList({x: 0, y: 0}, boundaryBlocks, newPath))
                    {
                        this.pathList.push(newPath);

                        // find arrow box that's the cloest to the player,
                        // but also points (somewhat) towards where the player is 
                        // to get the path where the zombie should approximately follow
                        // if the pathfinding algorithm goes on for too long
                        let blockXDistance = newPath.x - player.hitbox.x;
                        let blockYDistance = newPath.y - player.hitbox.y;
                        let tempDistance = Math.sqrt((blockXDistance * blockXDistance) + (blockYDistance * blockYDistance));

                        if (newPath.direction == this.pathList[0].direction && tempDistance < distance)
                        {
                            distance = tempDistance;
                            tempPath = newPath;
                        }
                    }
                }

                if (checkCollisionSingle({x: 0, y: 0}, newPath, player.hitbox))
                {
                    touchPlayer = true;
                    newPath.partOfPath = true;
                    this.pathToFollow.push(newPath);
                    stopAt = newPath;
                    break;
                }
            }
        }

        // if the pathfinding algorithm goes on for too long
        // if no arrow box was close enough and pointed towards the player
        if (stopAt == null && tempPath == null)
        {
            this.pathList[this.pathList.length - 1].partOfPath = true;
            this.pathToFollow.push(this.pathList[this.pathList.length - 1]);
            stopAt = this.pathList[this.pathList.length - 1];           
        }
        else if (stopAt == null)
        {
            tempPath.partOfPath = true;
            this.pathToFollow.push(tempPath);
            stopAt = tempPath;
        }

        // go back from arrow box that touches player and stop at starting arrow box
        while (stopAt != this.pathList[0])
        {
            let tempPath = null;

            // puts tempPath in front of arrow box and moves back according to the direction
            if (stopAt.direction == "up")
            {
                tempPath = new arrowPathBox(stopAt.x, stopAt.y + stopAt.height, this.width / 1.6, this.height / 1.6, "up");
            }
            else if (stopAt.direction == "left")
            {
                // -0.5 since left & right arrow y is not perfectly aligned
                tempPath = new arrowPathBox(stopAt.x + stopAt.width, stopAt.y - 0.5, this.width / 1.6, this.height / 1.6, "left");
            }
            else if (stopAt.direction == "right")
            {
                tempPath = new arrowPathBox(stopAt.x - stopAt.width, stopAt.y - 0.5, this.width / 1.6, this.height / 1.6, "right");
            }
            else if (stopAt.direction == "down")
            {
                tempPath = new arrowPathBox(stopAt.x, stopAt.y - stopAt.height, this.width / 1.6, this.height / 1.6, "down");
            }

            // check if there is an arrow box behind
            for (let i = 0; i < this.pathList.length; i++)
            {
                if (checkCollisionSingle({x: 0, y: 0}, this.pathList[i], tempPath))
                {
                    this.pathList[i].partOfPath = true;
                    this.pathToFollow.push(this.pathList[i]);
                    stopAt = this.pathList[i];
                    break;
                }
            }
        }

        // last element is the starting arrow box
        this.#currentBox = this.pathToFollow.length - 1;
    }

    drawPathfind()
    {
        //for (let i = this.pathList.length - 1; i >= 0; i--)
        //{
        //    this.pathList[i].draw();
        //}

        for (let i = this.pathToFollow.length - 1; i >= 0; i--)
        {
            this.pathToFollow[i].draw();
        }
    }

    // speed must be positive
    #followPath(speed) 
    {
        if (this.#currentBox >= 0)
        {
            let box = this.pathToFollow[this.#currentBox];

            if (box.direction == "up")
            {
                this.y = this.y - speed;
                this.hitbox.y = this.hitbox.y - speed;

                if (this.y < box.y + box.height / 2)
                {
                    this.#currentBox = this.#currentBox - 1;
                }
            }
            else if (box.direction == "left")
            {
                this.x = this.x - speed;
                this.hitbox.x = this.hitbox.x - speed;

                if (this.x < box.x + box.width / 2)
                {
                    this.#currentBox = this.#currentBox - 1;
                }
            }
            else if (box.direction == "right")
            {
                this.x = this.x + speed;
                this.hitbox.x = this.hitbox.x + speed;

                if (this.x > box.x + box.height / 2)
                {
                    this.#currentBox = this.#currentBox - 1;
                }
            }
            else if (box.direction == "down")
            {
                this.y = this.y + speed;
                this.hitbox.y = this.hitbox.y + speed;

                if (this.y > box.y + box.width / 2)
                {
                    this.#currentBox = this.#currentBox - 1;
                }
            }
        }
        else if (!checkCollisionSingle({x: 0, y: 0}, this.hitbox, player.hitbox))
        {
            this.pathfind();
        }
    }

    draw()
    {
        let xPlayerOffset = player.x - this.x;
        let yPlayerOffset = player.y - this.y;
        this.#zombieToPlayerAngle = Math.atan2(yPlayerOffset, xPlayerOffset);

        // save anything on the canvas before rotation
        context.save();
        // move zombie to make up for the rotation, so that zombie is in right spot
        context.translate(this.x, this.y);
        context.rotate(this.#zombieToPlayerAngle);
        // draw zombie WITH rotation
        // negative width/height to make up for rotation and put zombie back to their center
        context.drawImage(zombieImg, -this.width / 2, -this.height / 2, this.width, this.height);
        // restore the old canvas before rotation
        context.restore();

        if (!checkCollisionSingle({x: 0, y: 0}, player.hitbox, this.hitbox))
        {
            this.#followPath(this.speed);
        }
        else
        {
            player.hp = player.hp - 0.5;
        }
    }
}

var zombies = [];
let randomLocation = Math.floor(Math.random() * 22); // 0 - 24
zombies.push(new Zombie(spawnBlocks[randomLocation].x, spawnBlocks[randomLocation].y, 70, 70, 100, 3.5));
zombies[0].hitbox.update(zombies[0], (zombies[0].width / 2) / 1.6);
zombies[0].pathfind();