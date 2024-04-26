class spriteHitBox
{
    #width; 
    #height;

    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.#width = width;
        this.#height = height;
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

    update(entity, offset) // make hitbox follow the center
    {
        // stay at center of entity and then adjust for hitbox size
        this.x = entity.x - offset;
        this.y = entity.y - offset;
    }
}