const mongoose = require('mongoose');
const db = require('../models/auth');



// mongoose.connect('mongodb://localhost:27017/tradeApp', { 
//     useNewUrlParser: true, 
//     useUnifiedTopology: true
// });

// mongoose.connection.on("error", console.error.bind(console, "connection error:"));
// mongoose.connection.once("open", () => {
//     console.log('Database connected');
// })

async function populateUserDB()
    {
        const user = new db({
            username: "Tim2",
            password: "Test2",
            emailAddr: "tim2@gmail.com"
        })
        await user.save();
    }

populateUserDB().then(() => {
    mongoose.connection.close();
})
