const db = require('../config/config');

module.exports = {
    getAllRooms,
    getDirections,
    addRoom,
    getRoomByID,
    updateDirection,
    updateRoom
}

async function getAllRooms() {
    return await db("rooms AS rm")
        .innerJoin('directions AS dir', 'rm.room_id', 'dir.room_id')
}

async function getRoomByID(room_id) {
    return await db('rooms')
        .where({ room_id })
}

async function getDirections(room_id) {
    return await db("directions AS d")
        .where({ room_id })
        .select('d.north', 'd.south', 'd.east', 'd.west')
}

async function updateDirection(room_info) {
    console.log(room_info)
    return await db('directions AS d')
        .where({ room_id: room_info.room_id })
        .update({ [room_info.direction]: room_info.dir_room_id })
}

async function updateRoom(room_info) {
    return await db('rooms AS r')
        .where({ room_id: room_info.room_id })
        .update(room_info)
}

async function addRoom(room_info) {
    try {
        await db('rooms')
            .insert({
                room_id: room_info.room_id,
                type: room_info.type,
                title: room_info.title,
                description: room_info.description,
                coordinates: room_info.coordinates,
                terrain: room_info.terrain,
                elevation: room_info.elevation
            })
        await db('directions')
            .insert({
                room_id: room_info.room_id,
                north: room_info.north,
                south: room_info.south,
                east: room_info.east,
                west: room_info.west
            })
        return true
    }
    catch (err) {
        return false
    }
}