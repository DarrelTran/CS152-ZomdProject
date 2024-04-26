class Wave 
{
    constructor()
    {   
        this.currentWave = 1;
        this.zombiesToSpawn = 0;
        this.onGoingWave = true; // if all zombies for the current wave are alive or not
        this.startNextWave = false;
        this.zombieHealth = 100;
        this.zombieSpeed = 3.5;
    }   

    checkTime()
    {
        // wait until all zombies killed before advancing waves
        // player has to initiate the next wave
        if (zombies.length <= 0 && this.onGoingWave)
        {
            this.onGoingWave = false;
        }
        
        if (zombies.length <= 0 && !this.onGoingWave && this.startNextWave)
        {
            this.currentWave = this.currentWave + 1;
            this.zombiesToSpawn = this.zombiesToSpawn + 5;

            for (let i = 0; i < this.zombiesToSpawn; i++)
            {
                let randomLocation = Math.floor(Math.random() * 22); // 0 - 24
                
                this.zombieHealth = this.zombieHealth + 3;
                this.zombieSpeed = this.zombieSpeed + 0.05;
                let newZombie = new Zombie(spawnBlocks[randomLocation].x, spawnBlocks[randomLocation].y, 70, 70, this.zombieHealth, this.zombieSpeed) 
                newZombie.hitbox.update(newZombie, (newZombie.width / 2) / 1.6);
                newZombie.pathfind();

                zombies.push(newZombie);
            }

            this.startNextWave = false;
            this.onGoingWave = true;
        }
    }
}

var wave = new Wave();