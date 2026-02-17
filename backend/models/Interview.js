const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    messages: [{
        sender: {
            type: String,
            enum: ['system', 'user', 'ai'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    feedback: {
        score: Number,
        summary: String,
        areasForImprovement: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', InterviewSchema);
