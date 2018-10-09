const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then( () => { console.log("Connected to MongoDB") })
    .catch(error => { console.log("No conectado") });

    
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

app.get('/', (req, res) =>{
    res.send("Welcome to Video");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on ${port}....`);
})


