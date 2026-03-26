import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    normalTokens: {
        type: Number,
        default: 3
    },
    specialTokens: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;