const { connectDB } = require('../database/main');
const { ObjectId } = require('mongodb');

const Router = require('express').Router();

let db;

(async () => {
    db = await connectDB();
})();

Router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await db.collection('events').findOne({ _id: new ObjectId(id) });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event,
            message: 'Event fetched successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: `Failed to fetch event: ${err.message}`
        });
    }
});

Router.get('/', async (req, res) => {
    try {
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

    try {
        // Validate required ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        const updates = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.location !== undefined) updates.location = req.body.location;
        if (req.body.type !== undefined) updates.type = req.body.type;
        if (req.body.date_time !== undefined) updates.date_time = req.body.date_time;
        if (req.body.cover_image !== undefined) updates.cover_image = req.body.cover_image;
        if (req.body.register_type !== undefined) updates.register_type = req.body.register_type;

        const result = await db.collection('events').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
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