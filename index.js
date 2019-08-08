const express = require('express');
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')


//database setup with mongodb ^3.1.0
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true })

//app boilerplate with expressjs and some middleware
app.use(morgan('combined'))// .use applies middleware, remember?
app.use(bodyParser.json({type: '*/*'}))
router(app)

const port = process.env.PORT || 3090;

const server = http.createServer(app)
server.listen(port)
console.log('server listening on port', port);
