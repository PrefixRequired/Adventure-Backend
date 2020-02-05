const express = require('express');

const Rooms = require('../models/rooms-m');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const rooms = await Rooms.getAllRooms();
        let newRooms = await rooms.map((item, i) => {
            let newArr = {
                "room_id": item.room_id,
                "title": item.title,
                "type": item.type,
                "description": item.description,
                "coordinates": item.coordinates,
                "terrain": item.terrain,
                "elevation": item.elevation,
            }
            let dir = {
                "north": item.north,
                "south": item.south,
                "east": item.east,
                "west": item.west
            }
            for (direct in dir) {
                if (item[direct] !== -2) {
                    newArr['dir'] = { [direct]: item[direct], ...newArr['dir'] }
                }
            }
            return newArr
        })
        res.status(200).json(newRooms)
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get rooms." });
    }
});

router.post('/', async (req, res) => {
    try {
        let doesExist = await Rooms.getRoomByID(req.body.room_id);
        if (doesExist.length > 0) {
            res.status(304).json({})
            return;
        }
        const room = await Rooms.addRoom(req.body);
        console.log('room', room)
        if (room) {
            res.status(201).json({})
        } else {
            res.status(500).json({ message: "Rooms couldn't be added to DB." })
        }
    }
    catch (err) {
        res.status(500).json({ message: 'There was an error when adding this room.' })
    }
});

router.post('/directions', async (req, res) => {
    // console.log(req)
    try {
        const dir = await Rooms.getDirections(req.body.room_id);
        if (dir.length === 0) {
            res.status(404).json({ message: 'Room directions not found, try again.' })
        }
        let newDir = await dir.map(item => {
            console.log('item', item)
            let newItem = {}
            for (d in item) {
                if (item[d] !== -2) {
                    newItem[d] = item[d]
                }
            }
            return newItem
        })
        res.status(200).json(newDir[0])
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get directions, try again." })
    }
});

router.post('/directions/update', async (req, res) => {
    try {
        const directions = await Rooms.updateDirection(req.body)
        res.status(204).json({})
    }
    catch (err) {
        res.status(500).json({ message: "There was an error updating direction, try again." })
    }
});

router.post('/update', async (req, res) => {
    console.log(req.body, "request body")
    try {
        const room = await Rooms.updateRoom(req.body)
        console.log(room, "<-- room")
        res.status(204).json({})
    }
    catch (err) {
        res.status(500).json({ message: "There was an error updating direction, try again." })
    }
});

module.exports = router;