const mongoose = require('mongoose');

const username = 'sweetcornermail';
const password = 'rL3Sn4tKuU1npsNA';

var dbUrl = 'mongodb+srv://'+username+':'+password+'@cluster-sc.euxgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-SC';



const connectToMongo = ()=>{
    mongoose.connect(dbUrl).then()
    .catch((err) => { console.error(err); });
}

module.exports = connectToMongo;