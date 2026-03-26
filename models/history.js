import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    url: { type: String, required: true },
    result: { type: Object, required: true },
}, {
    timestamps: true
});

const History = mongoose.models.History || mongoose.model('History', historySchema);
export default History;
