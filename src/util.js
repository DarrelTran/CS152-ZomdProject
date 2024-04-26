// offset to "predict" when character will collide
function checkCollisionList(offset = {x: 0, y: 0}, list, entity)
{
    for (let i = 0; i < list.length; i++)
    {   
        const listEntity = list[i];
        let touching = listEntity.y + offset.y + listEntity.height > entity.y &&
                       listEntity.y + offset.y < entity.y + entity.height &&
                       listEntity.x + offset.x + listEntity.width > entity.x && 
                       listEntity.x + offset.x < entity.x + entity.width;

        if (touching)
        {
            return true;
        }
    }

    return false;
}

function checkCollisionSingle(offset = {x: 0, y: 0}, entity, otherEntity)
{
    let touching = entity.y + offset.y + entity.height > otherEntity.y &&
                   entity.y + offset.y < otherEntity.y + otherEntity.height &&
                   entity.x + offset.x + entity.width > otherEntity.x && 
                   entity.x + offset.x < otherEntity.x + otherEntity.width;

    if (touching)
    {
        return true;
    }

    return false;
}

function checkCollisionValues(offset = {x: 0, y: 0}, entityX, entityY, entityWidth, entityHeight, otherEntityX, otherEntityY, otherEntityWidth, otherEntityHeight)
{
    let touching = entityY + offset.y + entityHeight > otherEntityY &&
                   entityY + offset.y < otherEntityY + otherEntityHeight &&
                   entityX + offset.x + entityWidth > otherEntityX && 
                   entityX + offset.x < otherEntityX + otherEntityWidth;

    if (touching)
    {
        return true;
    }

    return false;
}