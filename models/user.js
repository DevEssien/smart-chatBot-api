const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chat: [
        {
            conversationId: Schema.Types.ObjectId,
            first_search: String,
            conversation: [
                {
                    role: String,
                    content: String
                }
            ],
            conversation_length: Number
        }
    ]
});

module.exports = mongoose.model('User', userSchema)