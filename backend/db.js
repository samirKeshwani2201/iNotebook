const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://samir8:Gyan%402021@newcluster.kjp9sxu.mongodb.net/inotebook'

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to Mongo Sucessfully")
        // useNewUrlParser: true
    })
}
module.exports = connectToMongo

