const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AudioMetrics_Schema = new Schema({

    user_id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "users",
         },

         transcript: { type: String, required: true },
         transcriptWithTimeStamp: { type: Array, required: true },
         videoUrls: { type: Array, required: true }, 
    
    is_del: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date
    }
});


const AudioMetrics_Schema_Model = mongoose.model('audio_metrics', AudioMetrics_Schema);
module.exports = AudioMetrics_Schema_Model;
