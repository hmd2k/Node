const express = require('express') 
require("./Configuration/DbConnection").connect();
const mongoose = require('mongoose');
const { Socket } = require('socket.io');

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
require("./Configuration/Socket").connect(io);
require("./Configuration/Scheduler").startScheduler();
app.use(express.json())


const employeeRouter = require('./Controller/EmployeeController')
app.use('/employee',employeeRouter)

const loginRouter = require('./Controller/LoginController')
app.use('/login',loginRouter)

app.get('/',(req,res) => {
    res.sendFile(__dirname+"/Ui/Board.html")
})

app.get('/admin',(req,res) => {
    res.sendFile(__dirname+"/Ui/Admin.html")
})

http.listen(8080,() => {
    console.log('server started....')
})
