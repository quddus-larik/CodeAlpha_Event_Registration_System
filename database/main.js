const { MongoClient } = require('mongodb');
require('dotenv').config();

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event_registration_system';
const client = new MongoClient(URI);

async function connectDB() {
    try {
        await client.connect();
        const db = client.db();
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

module.exports = { connectDB, client };