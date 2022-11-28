var ioObj

const connect = (io)=>{
    
    ioObj = io
    io.on('connection',(socket) => {
        console.log('New io connection established');
    
        socket.on('disconnect',() => {
            console.log('io connection closed');
        })
    
        socket.on('message',(msg) => {
            io.emit('notification',msg)
        })
    })
    }

const sentAddNotif = (name) => {
    ioObj.emit('notification',"New user "+name+" added")
}

    module.exports = {connect,sentAddNotif}