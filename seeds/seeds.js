const mongoose = require('mongoose');
const postDB = require('../models/postSchema');
const cities = require('./cities');
const { descriptors } = require('./titleName');
const dataPoints = 75;
const { types } = require('./types');

mongoose.connect('mongodb://localhost:27017/tradeApp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log('Database connected');
})

function findSample(arr)
{
    return arr[Math.floor(Math.random() * arr.length)];
}

async function populatePostDB()
{
    await postDB.deleteMany({});
    for(let i = 0; i < dataPoints; i++)
    {
        const randomNum = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 30) + 10
        const post = new postDB({
            title: `${findSample(descriptors)}`,
            description: 'This is the discription, empty for now.',
            city: `${cities[randomNum].city}`,
            state: `${cities[randomNum].state}`,
            image: 'https://source.unsplash.com/collection/874140',
            type: `${findSample(types)}`,
            tradeFor: `${findSample(types)}`,
            author: '632f8b794922ce30b8a9f0c0',
            offer: '632f8b794922ce30b8a9f0c0'
            });
        await post.save();
    }
}

populatePostDB().then(() => {
    mongoose.connection.close();
})