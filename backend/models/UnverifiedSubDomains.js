const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Unverified_SubDomains_Schema = new Schema({


user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
 sendGrid_id : Number,
 sendGrid_user_id : Number,
 sendGrid_username : String,

 domain : String,
 subDomain : String,
 senderScore : {

   type: Number,
   default : 100
 },

 cname1Name : String,
 cname1Value : String,

 cname2Name : String,
 cname2Value : String,

 cname3Name : String,
 cname3Value : String,

 dmarcRecordName : String,
 dmarcRecordValue : String,

 txtRecordName : String,
 txtRecordValue : String,

 txtRecordStatus : {
    type: Boolean,
    default : false
 },

 cname1RecordStatus : {
    type: Boolean,
    default : false
 },

 cname2RecordStatus : {
   type: Boolean,
   default : false
},

cname3RecordStatus : {
   type: Boolean,
   default : false
},

 dmarcRecordStatus : {
    type: Boolean,
    default : false
 },

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


const Unverified_SubDomains_Schema_Model = mongoose.model('unverified_subdomains', Unverified_SubDomains_Schema);
module.exports = Unverified_SubDomains_Schema_Model;
