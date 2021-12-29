
const express = require('express');

const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 58585
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.end('note-publish');
})

app.get('/api', (req, res) => {
    res.end('note-publish /api');
})

module.exports = app;

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at port ${port}`)
});