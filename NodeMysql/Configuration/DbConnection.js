const mysql = require('mysql')

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Innovature@123',
    database : 'nodemysql'
})

connection.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Mysql connected .....");
    }
})

module.exports = connection


