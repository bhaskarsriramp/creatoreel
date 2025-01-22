const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Campaigns_Schema = new Schema({



    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },

    tags : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags",
      }],

      campaignTitle : String,

    fromName: String,
    fromEmail: String,
    subDomain : String,

    subject: String,

    previewText: String,

    emailContent: String,

    status : String,

    sent_contacts : Number,
    contacts_delivered : [],
    contacts_opened : [],
    contacts_clicked : [],
    contacts_bounced : [],
    contacts_spam : [],
    contacts_dropped : [],
    contacts_unsubscribed : [],

      bounce_rate : Number,

      complaint_rate : Number,

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


const Campaigns_Schema_Model = mongoose.model('campaigns', Campaigns_Schema);
module.exports = Campaigns_Schema_Model;
