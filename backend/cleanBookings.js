import mongoose from 'mongoose';

const clean = async () => {
    await mongoose.connect('mongodb://localhost:27017/jobpilot');
    const db = mongoose.connection.db;

    const result = await db.collection('bookings').aggregate([
        { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'svc' } },
        { $match: { 'svc': { $size: 0 } } },
        { $project: { _id: 1 } }
    ]).toArray();

    if (result.length === 0) {
        console.log('No orphaned bookings found.');
        process.exit(0);
    }

    const ids = result.map(r => r._id);
    await db.collection('bookings').deleteMany({ _id: { $in: ids } });
    console.log(`Deleted ${ids.length} orphaned test bookings.`);
    process.exit(0);
};

clean().catch(err => { console.error(err.message); process.exit(1); });
