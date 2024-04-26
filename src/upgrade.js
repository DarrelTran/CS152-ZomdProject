class Upgrade
{
    constructor(upgradeType, upgradeAmount, x, y, width, height)
    {   
        this.upgradeType = upgradeType;
        this.upgradeAmount = upgradeAmount;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.upgradeImage = null;
        this.collisionText = "";
        this.upgradePrice = 0;

        switch(this.upgradeType)
        {
            case "healingUpgrade":
                this.upgradeImage = healingImg;
                this.collisionText = "Press E to buy a full heal for 5 coins."
                this.upgradePrice = 5;
                break;
            case "healthUpgrade":
                this.upgradeImage = healthUpgradeImg;
                this.collisionText = "Press E to buy a health increase of 10 points for 25 coins."
                this.upgradePrice = 25;
                break;
            case "addPistolAmmoUpgrade":
                this.upgradeImage = morePistolAmmoImg;
                this.collisionText = "Press E to buy 15 pistol ammo for 1 coin."
                this.upgradePrice = 1;
                break;
            case "addRifleAmmoUpgrade":
                this.upgradeImage = moreRifleAmmoImg;
                this.collisionText = "Press E to buy 30 rifle ammo for 5 coins."
                this.upgradePrice = 5;
                break;
            case "addShotgunAmmoUpgrade":
                this.upgradeImage = moreShotgunAmmoImg;
                this.collisionText = "Press E to buy 6 shotgun ammo for 10 coins."
                this.upgradePrice = 10;
                break;
            case "buyRifleUpgrade":
                this.upgradeImage = buyRifleImg;
                this.collisionText = "Press E to buy a rifle for 100 coins."
                this.upgradePrice = 100;
                break;
            case "buyShotgunUpgrade":
                this.upgradeImage = buyShotgunImg;
                this.collisionText = "Press E to buy a shotgun for 200 coins."
                this.upgradePrice = 200;
                break;
            case "damageUpgrade":
                this.upgradeImage = moreDamageImg;
                this.collisionText = "Press E to buy a damage increase of 5 damage for 100 coins."
                this.upgradePrice = 100;
                break;
            case "speedUpgrade":
                this.upgradeImage = speedUpgradeImg;
                this.collisionText = "Press E to buy a movement speed upgrade of 1 speed for 50 coins."
                this.upgradePrice = 50;
                break;
            case "nextWave":
                this.upgradeImage = nextWaveIconImg;
                this.collisionText = "Press E to advance to the next wave."
                this.upgradePrice = 0;
                break;
        }
    }

    upgrade()
    {
        if (player.money >= this.upgradePrice)
        {
            switch(this.upgradeType)
            {
                case "healingUpgrade":
                    player.hp = this.upgradeAmount;
                    break;
                case "healthUpgrade":
                    player.maximumHealth = player.maximumHealth + this.upgradeAmount;
                    player.hp = player.hp + this.upgradeAmount;
                    break;
                case "addPistolAmmoUpgrade":
                    player.heldPistolAmmo = player.heldPistolAmmo + this.upgradeAmount;
                    break;
                case "addRifleAmmoUpgrade":
                    player.heldRifleAmmo = player.heldRifleAmmo + this.upgradeAmount;
                    break;
                case "addShotgunAmmoUpgrade":
                    player.heldShotgunAmmo = player.heldShotgunAmmo + this.upgradeAmount;
                    break;
                case "buyRifleUpgrade":
                    player.riflePurchased = true;
                    player.inventory[1] = "rifle";
                    player.rifleAmmo = 30;
                    player.heldRifleAmmo = 30;
                    break;
                case "buyShotgunUpgrade":
                    player.shotgunPurchased = true;
                    player.inventory[2] = "shotgun";
                    player.shotgunAmmo = 6;
                    player.heldShotgunAmmo = 6;
                    break;
                case "damageUpgrade":
                    player.damageModifier = player.damageModifier + this.upgradeAmount;
                    break;
                case "speedUpgrade":
                    player.speed = player.speed + this.upgradeAmount;
                    break;
                case "nextWave":
                    wave.startNextWave = true;
                    break;
            }

            player.money = player.money - this.upgradePrice;
        }
    }

    draw()
    {
        context.drawImage(this.upgradeImage, this.x, this.y, this.width, this.height);
    }
}

var healingUpgrade = new Upgrade("healingUpgrade", player.maximumHealth, 2000, 1200, 100, 100);
var healthUpgrade = new Upgrade("healthUpgrade", 10, 2200, 1200, 100, 100);
var damageUpgrade = new Upgrade("damageUpgrade", 5, 2400, 1200, 100, 100);
var speedUpgrade = new Upgrade("speedUpgrade", 1, 2600, 1200, 100, 100);

var addPistolAmmoUpgrade = new Upgrade("addPistolAmmoUpgrade", 15, 2000, 1350, 100, 100);
var addRifleAmmoUpgrade = new Upgrade("addRifleAmmoUpgrade", 30, 2200, 1350, 100, 100);
var addShotgunAmmoUpgrade = new Upgrade("addShotgunAmmoUpgrade", 6, 2400, 1350, 100, 100);
var buyRifleUpgrade = new Upgrade("buyRifleUpgrade", -1, 2600, 1350, 100, 100);

var buyShotgunUpgrade = new Upgrade("buyShotgunUpgrade", -1, 2000, 1500, 100, 100);

var nextWave = new Upgrade("nextWave", -1, 2200, 1500, 100, 100);

var upgrades = 
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