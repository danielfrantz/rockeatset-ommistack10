const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://df-oministack:oministack@cluster0-1cojt.mongodb.net/weak10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.get('/', (request, response) => {
    return response.json({message:'hello daneil'});
});

app.listen(3333);