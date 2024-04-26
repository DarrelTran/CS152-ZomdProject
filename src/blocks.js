class Block 
{
    #width;
    #height;

    constructor(x, y, width, height, color)
    {
        this.#width = width;
        this.#height = height;
        this.x = x;
        this.y = y;
        this.color = color;
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
}

var collisionMap = [];
function createBoundaryFromData(boundaryBlocks)
{
    // collisions in collisions.js
    for (let i = 0; i < collisions.length; i = i + 512)
    {
        // iterate through collisions array in increments of map's width
        // since want to go through map "row by row"
        collisionMap.push(collisions.slice(i, i + 512));
    }
    
    // each ith element is the row, aka the y
    // each jth element is the column, aka the x
    for (let y = 0; y < collisionMap.length; y++)
    {
        for (let x = 0; x < collisionMap.length; x++)
        {
            // 32 tile size * 25% = 8 tile size
            // tile is made up of these small 8x8 pixel squares
            if (collisionMap[y][x] == 280)
            {
                // red = can shoot through but still stops movement
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 8, 8, "red"); // 1x1 
                boundaryBlocks.push(tempBlock);
            }
            // other colors = can't shoot through but still stops movement
            else if (collisionMap[y][x] == 281 || collisionMap[y][x] == 2684354841)
            {
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 24, 24, "purple"); // 3x3
                boundaryBlocks.push(tempBlock);
            }
            else if (collisionMap[y][x] == 287)
            {
                // purple = can shoot through but still stops movement
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 24, 320, "aquamarine"); // 3x40
                boundaryBlocks.push(tempBlock);
            }
            else if (collisionMap[y][x] == 288)
            {
                // purple = can shoot through but still stops movement
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 320, 24, "blue"); // 40x3
                boundaryBlocks.push(tempBlock);
            }
            else if (collisionMap[y][x] == 290)
            {
                // purple = can shoot through but still stops movement
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 80, 24, "yellow"); // 10x3
                boundaryBlocks.push(tempBlock);
            }
            else if (collisionMap[y][x] == 289)
            {
                // purple = can shoot through but still stops movement
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 24, 80, "goldenrod"); // 3x10
                boundaryBlocks.push(tempBlock);
            }
        }
    }
}

var spawnMap = [];
function createSpawnsFromData(spawnBlock)
{
    // collisions in collisions.js
    for (let i = 0; i < spawnZones.length; i = i + 512)
    {
        // iterate through collisions array in increments of map's width
        // since want to go through map "row by row"
        spawnMap.push(spawnZones.slice(i, i + 512));
    }
    
    // each ith element is the row, aka the y
    // each jth element is the column, aka the x
    for (let y = 0; y < spawnMap.length; y++)
    {
        for (let x = 0; x < spawnMap.length; x++)
        {
            if (spawnMap[y][x] == 284)
            {
                // purple = can shoot through but still stops movement
                let tempBlock = new Block((x * 8) + background.x, (y * 8) + background.y, 80, 80, "green");
                spawnBlock.push(tempBlock);
            }
        }
    }
}

var boundaryBlocks = [];
createBoundaryFromData(boundaryBlocks, background);

var spawnBlocks = []; // 22 spawn locations
createSpawnsFromData(spawnBlocks, background); 