const { connectDB } = require('../database/main');
const { ObjectId } = require('mongodb'); // Added ObjectId import

const Router = require('express').Router();

Router.get('/', async (req, res) => {
    try {
        const db = await connectDB();
        const data = await db.collection('events').find({}).toArray();
        res.status(200).send({
            success: true,
            data: data,
            message: 'Data fetched successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            data: [],
            message: `failed to fetch data: ${err.message}` // Fixed errr → err
        })
    }
});

Router.post('/', async (req, res) => {
    const {
        title,
        description,
        location,
        type,
        date_time,
        cover_image,
        register_type,
    } = req.body;

    try {
        const db = await connectDB();
        const result = await db.collection('events').insertOne({ // Fixed evets → events
            title,
            description,
            location,
            type,
            date_time,
            cover_image,
            register_type,
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: {
                id: result.insertedId,
                title,
                description,
                location,
                type,
                date_time,
                cover_image,
                register_type,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
});

Router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        location,
        type,
        date_time,
        cover_image,
        register_type,
    } = req.body;

    try {
        const db = await connectDB();

        // Validate required ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        const result = await db.collection('events').findOneAndUpdate( // Fixed evets → events
            { _id: new ObjectId(id) },
            {
                $set: {
                    title,
                    description,
                    location,
                    type,
                    date_time,
                    cover_image,
                    register_type,
                }
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: {
                id: result._id,
                title: result.title,
                description: result.description,
                location: result.location,
                type: result.type,
                date_time: result.date_time,
                cover_image: result.cover_image,
                register_type: result.register_type,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
});

Router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectDB();

        // Validate required ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        const result = await db.collection('events').findOneAndDelete({
            _id: new ObjectId(id)
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            data: {
                id: result._id,
                title: result.title,
                description: result.description,
                location: result.location,
                type: result.type,
                date_time: result.date_time,
                cover_image: result.cover_image,
                register_type: result.register_type,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
});

module.exports = Router;