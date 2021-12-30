
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const postApi = require('./api/post');

const app = express();
const port = process.env.PORT || 58585
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.end('note-publish');
});

app.get('/api/post', (req, res) => {
    res.end('/api/post');
});

app.post('/api/post', (req, res) => {
    postApi(req, res);
});

module.exports = app;

app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at port ${port}`)
});