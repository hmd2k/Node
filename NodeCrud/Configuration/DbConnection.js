const mongoose = require('mongoose')
const url = "mongodb://localhost/NodeCrud";

exports.connect = ()=>{
mongoose.connect(url, {useNewUrlParser:false})
.then(()=>{
    console.log('connected....')
})
.catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  })
}