main(); // Calls main on script load to start everything up

function main()
{
    if (context == null)
    {
        alert("Unable to initialize 2D canvas API. Please make sure your browser supports the 2D canvas API.");
   
        // ends execution of this file
        return; 
    }

    canvas.height = 4096 // 16384
    canvas.width = 4096 

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // TODO: remove default mouse pointer and use custom "pointer" to deal with sprite offset
    // https://stackoverflow.com/questions/1071356/is-it-possible-to-hide-the-cursor-in-a-webpage-using-css-or-javascript
    canvas.addEventListener("mousemove", function(event)
    {
        // distance between mouse and player
        let xDistance = event.pageX - player.x;
        let yDistance = event.pageY - player.y;
        // angle from player to mouse in radians
        angle = Math.atan2(yDistance, xDistance);
        // make angle positive
        if (angle < 0)
        {
            angle = angle + Math.PI + Math.PI;
        }
    })

    function setKeysPressed(key, boolean)
    {
        if (key == 'w')
        {
            moveMap.set('w', boolean);
        }
        else if (key == 'a')
        {
            moveMap.set('a', boolean);
        }
        else if (key == 's')
        {
            moveMap.set('s', boolean);
        }
        else if (key == 'd')
        {
            moveMap.set('d', boolean);
        }
    }

    var ePressed = false;

    window.addEventListener("keypress", function(event)
    {
        let currentAmmo = player.getCurrentAmmo();
        let heldAmmo = player.getHeldAmmo();

        // player is allowed to move when key pressed
        setKeysPressed(event.key, true);

        if (event.key == "3" && player.inventory.length > 2 && !player.isReloading) // shotgun
        {
            player.weapon = "shotgun";
            player.ammoCapacity = 6;
        }
        else if (event.key == "2" && player.inventory.length > 1 && !player.isReloading) // rifle
        {
            player.weapon = "rifle";
            player.ammoCapacity = 30;
        }
        else if (event.key == "1" && !player.isReloading) // pistol
        {
            player.weapon = "pistol";
            player.ammoCapacity = 15;
        }

        if (event.key == "r" && currentAmmo < player.ammoCapacity && !player.isReloading && heldAmmo > 0)
        {
            reloadStart = performance.now();
            player.isReloading = true;
        }

        if (event.key == "e")
        {
            ePressed = true;
        }
    })

    window.addEventListener("keydown", function(event)
    {
        // player allowed to move if the same key is held down
        setKeysPressed(event.key, true);
    })

    window.addEventListener("keyup", function(event)
    {
        // player stops moving when key stops being pressed
        setKeysPressed(event.key, false);

        ePressed = false;
    })

    var start = 0
    var end = 0;
    var gunInterval = 0;
    var reloadStart = 0;
    var reloadEnd = 0;

    var mouseX = 0;
    var mouseY = 0;

    canvas.addEventListener("mousedown", function(event)
    {   
        if (player.hp <= 0)
        {
            mouseX = event.pageX;
            mouseY = event.pageY;

            // click yes
            if (checkCollisionValues({x: 0, y: 0}, player.x - 175, player.y + 25, 200, 100, mouseX, mouseY, 0, 0))
            {
                // reset background
                background = new Background(0, 0);

                // reset player
                player = new Player(700, 350, 70, 70, 100, "pistol");

                player.hitbox.update(player, (player.width / 2) / 1.6);

                collisionMap = [];
                boundaryBlocks = [];
                // reset collision
                createBoundaryFromData(boundaryBlocks, background);

                spawnMap = [];
                spawnBlocks = [];
                // reset spawn zones
                createSpawnsFromData(spawnBlocks, background); 
    
                context.globalAlpha = 0;
                boundaryBlocks.forEach(boundary =>
                {
                    context.fillStyle = boundary.color;
                    context.fillRect(boundary.x, boundary.y, boundary.width, boundary.height);
                }) 

                spawnBlocks.forEach(spawnBlock =>
                {
                    context.fillStyle = spawnBlock.color;
                    context.fillRect(spawnBlock.x, spawnBlock.y, spawnBlock.width, spawnBlock.height);
                }) 
                context.globalAlpha = 1;

                // reset wave control
                wave = new Wave();

                // reset upgrades
                upgrades = 
                [
                    healingUpgrade,
                    healthUpgrade,
                    damageUpgrade,
                    speedUpgrade,
                    addPistolAmmoUpgrade,
                    addRifleAmmoUpgrade,
                    addShotgunAmmoUpgrade,
                    buyRifleUpgrade,
                    buyShotgunUpgrade,
                    nextWave
                ];

                // reset bullets
                bullets = [];

                start = 0
                end = 0;
                gunInterval = 0;
                reloadStart = 0;
                reloadEnd = 0;
                angle = 0;
                ePressed = false;

                context.clearRect(0, 0, canvas.width, canvas.height);

                // reset zombies
                zombies = [];
                let randomLocation = Math.floor(Math.random() * 22); // 0 - 24
                zombies.push(new Zombie(spawnBlocks[randomLocation].x, spawnBlocks[randomLocation].y, 70, 70, 100, 3.5));
                zombies[0].hitbox.update(zombies[0], (zombies[0].width / 2) / 1.6);
                zombies[0].pathfind();

                // y is NaN
            }

            // click no
            if (checkCollisionValues({x: 0, y: 0}, player.x + 75, player.y + 25, 200, 100, mouseX, mouseY, 0, 0))
            {
                // closes current tab
                window.close();
            }
        }

        let currentAmmo = player.getCurrentAmmo();
        let heldAmmo = player.getHeldAmmo();

        switch(player.weapon)
        {
            case "knife":
                gunInterval = 0.1;
                break;
            case "pistol":
                gunInterval = 0.5;
                break;
            case "rifle":
                gunInterval = 1.0;
                break;
            case "shotgun":
                gunInterval = 1.0;
                break;
        }

        // 0 = left click, 1 = middle mouse, 2 = right click
        
        // delay system for non-automatic weapons
        // check current time after first click was pressed
        if (event.button == 0 && currentAmmo > 0 && !player.isReloading)
        {
            end = performance.now();
            let totalTime = ((end - start) / 1000);

            if (!this.firstShot || totalTime >= gunInterval)
            {
                generateBullets();

                this.firstShot = true;

                // reset timer
                start = 0;
            }
        }
        else if (event.button == 0 && currentAmmo <= 0 && !player.isReloading && heldAmmo > 0)
        {
            reloadStart = performance.now();
            player.isReloading = true;
        }
    })

    canvas.addEventListener("mouseup", function(event)
    {
        
    })

    player.hitbox.update(player, (player.width / 2) / 1.6);
    
    context.globalAlpha = 0;
    boundaryBlocks.forEach(boundary =>
    {
        context.fillStyle = boundary.color;
        context.fillRect(boundary.x, boundary.y, boundary.width, boundary.height);
    }) 

    spawnBlocks.forEach(spawnBlock =>
    {
        context.fillStyle = spawnBlock.color;
        context.fillRect(spawnBlock.x, spawnBlock.y, spawnBlock.width, spawnBlock.height);
    }) 
    context.globalAlpha = 1;

    function rotateUpgradeArrowAndDraw()
    {
        let xArrowDistance = upgrades[Math.floor(upgrades.length / 2)].x - player.x; 
        let yArrowDistance = upgrades[Math.floor(upgrades.length / 2)].y - player.y;
        let arrowAngle = Math.atan2(yArrowDistance, xArrowDistance);
        let arrowDistance = Math.sqrt((xArrowDistance * xArrowDistance) + (yArrowDistance * yArrowDistance));

        if (arrowDistance >= 250)
        {
            if (arrowAngle < 0)
            {
                arrowAngle = arrowAngle + Math.PI + Math.PI;
            }

            context.save();
            context.translate(player.x, player.y);
            context.rotate(arrowAngle);
            context.rotate(Math.PI / 2);
            context.drawImage(upgradeArrowImg, -200 / 2, -200 / 2, 200, 200);
            context.restore();
        }
    }

    // infinite gameplay loop
    // constantly draws new canvas with updated stuff
    // doesn't matter how fast image loads since its called repeatedly
    function animate()
    {
        // start timer again for how often you can fire the weapon for non-automatic weapons
        if (start == 0)
        {
            start = performance.now();
        }

        // prevents tons of unnecessary drawings being copied/drawn in a "lifespan"
        context.clearRect(0, 0, canvas.width, canvas.height);

        // helps clear paths to prevent lag
        // stroke does not close paths automatically
        context.closePath(); 

        // starts new path, resets path list with each call
        // helps to prevent lag when using something like fill or stroke
        // if not here, the fill or stroke can get drawn repeatedly causing lag
        context.beginPath();

        // draw before rotation so that background doesn't get rotated
        context.drawImage(backgroundImg, background.x, background.y); 

        if (player.hp > 0)
        {
            wave.checkTime();

            if (!wave.onGoingWave)
            {
                for (let i = 0; i < upgrades.length; i++)
                {
                    upgrades[i].draw();
                }
            }

            for (let i = 0; i < zombies.length; i++)
            {
                if (zombies[i].hp > 0)
                {
                    zombies[i].draw();
                }
                else
                {
                    zombies.splice(i, 1);

                    let randomMoney = Math.floor(Math.random() * (10 - 2) + 2);
                    player.money = player.money + randomMoney;
                }
            }

            for (let i = 0; i < bullets.length; i++)
            {
                let totalTime = 0;

                if (bullets[i].hasDelay)
                {
                    bullets[i].endTime = performance.now();

                    totalTime = (bullets[i].endTime - bullets[i].startTime) / 1000;
                }

                if (!bullets[i].hasDelay || (bullets[i].hasDelay && totalTime >= bullets[i].delay))
                {
                    if (bullets[i].hasDelay && totalTime >= bullets[i].delay)
                    {
                        bullets[i].hasDelay = false;
                    }

                    bullets[i].draw();

                    bullets[i].checkZombieCollision();

                    if (!bullets[i].checkOutOfBounds())
                    {
                        if (bullets[i].checkBoundaryCollision())
                        {
                            // remove the ith element
                            bullets.splice(i, 1);
                            --i;
                        }
                    }
                    else
                    {
                        bullets.splice(i, 1);
                        --i;
                    }
                }
            }

            player.draw();

            if (player.isReloading == true)
            {
                context.drawImage(reloadImg, player.x + 20, player.y, 30, 30);

                reloadEnd = performance.now();
                let totalTime = ((reloadEnd - reloadStart) / 1000);

                // shotgun reload is assumed to be shell by shell
                // less shells to put in = less reload time
                if (player.weapon == "shotgun")
                {
                    player.reloadTime = 6 * (1 - (player.shotgunAmmo / 6));
                }

                if (totalTime >= player.reloadTime)
                {
                    player.updateAmmoCount();

                    reloadStart = 0;
                    player.isReloading = false;
                }
            }

            player.move(); // Super smooth movement!!!! :O

            if (!wave.onGoingWave)
            {
                rotateUpgradeArrowAndDraw();
            }
            
            // draw the health bar 
            context.globalAlpha = 0.80;
            context.drawImage(healthImg, -15, 25, 75, 75);
            context.fillStyle = "white";
            context.strokeStyle = "black"; // outline color
            context.rect(49, 48.5, 200 + (player.maximumHealth - 100), 25);
            context.fill();
            context.stroke(); // outlines

            // draw the player's health bar
            context.fillStyle = "red";
            if (player.hp > 0)
            {
                context.fillRect(50, 50, (200 + (player.maximumHealth - 100)) * (player.hp / player.maximumHealth) - 2, 22);
            }
            else
            {
                context.fillRect(50, 50, 0.1, 22);
            }

            // UI info background
            context.globalAlpha = 0.30;
            context.fillStyle = "black";
            context.fillRect(1, 1, 500, 175);
            context.globalAlpha = 0.80;

            // wave text
            context.fillStyle = "orange";
            context.font = "bold 30px Arial";
            context.fillText("Wave: " + wave.currentWave, 5, 30);

            // money text
            context.drawImage(coinImg, -8, 70, 60, 60);
            context.fillText(player.money, 47, 111);

            // ammo text
            context.drawImage(ammoImg, -2, 120, 50, 50);
            context.fillText(player.getCurrentAmmo() + " / " + player.getHeldAmmo(), 47, 155);
            context.globalAlpha = 1;

            if (!wave.onGoingWave)
            {
                for (let i = 0; i < upgrades.length; i++)
                {   
                    if (checkCollisionSingle({x: 0, y: 0}, upgrades[i], player.hitbox))
                    {
                        context.fillStyle = "orange";
                        context.font = "bold 25px Arial";
                        context.fillText(upgrades[i].collisionText, player.x, player.y);
                        context.strokeStyle = "black";
                        context.lineWidth = 1.5; // border thickness
                        context.strokeText(upgrades[i].collisionText, player.x, player.y); // text border

                        if (ePressed == true)
                        {
                            if ((upgrades[i].upgradeType == "addRifleAmmoUpgrade" && player.riflePurchased) || (upgrades[i].upgradeType == "addShotgunAmmoUpgrade" && player.shotgunPurchased))
                            {
                                upgrades[i].upgrade();
                            }
                            else if (upgrades[i].upgradeType != "addRifleAmmoUpgrade" && upgrades[i].upgradeType != "addShotgunAmmoUpgrade")
                            {
                                upgrades[i].upgrade();
                            }

                            if (upgrades[i].upgradeType == "buyRifleUpgrade" || upgrades[i].upgradeType == "buyShotgunUpgrade")
                            {
                                upgrades.splice(i, 1);
                                --i;
                            }

                            ePressed = false;
                        }
                    }
                }
            }

            context.fillStyle = "white";
        }
        else 
        {
            context.globalAlpha = 0.85;
            context.fillStyle = "white";
            context.fillRect(player.x - 200, player.y - 50, 600, 200);
            context.globalAlpha = 1;
            context.fillStyle = "red";
            context.font = "bold 50px Arial";
            context.fillText("YOU DIED. RESTART?", player.x - 175, player.y);

            // Yes button
            context.fillStyle = "black";
            context.fillRect(player.x - 175, player.y + 25, 200, 100);
            context.fillStyle = "red";
            context.font = "bold 40px Arial";
            context.fillText("YES", player.x - 125, player.y + 90);

            // No button
            context.fillStyle = "black";
            context.fillRect(player.x + 75, player.y + 25, 200, 100);
            context.fillStyle = "red";
            context.font = "bold 40px Arial";
            context.fillText("NO", player.x + 140, player.y + 90);
        }
        
        // based on refresh rate
        requestAnimationFrame(animate);
    }

    animate();
}