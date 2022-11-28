const jwt = require('jsonwebtoken')

const employeeAccess = (req,res,next) => {
    const accessToken = req.headers["employee"]
    try{
        const decodedToken = jwt.verify(accessToken, process.env.TOKEN_KEY)
        if(decodedToken.role == "employee"){
            req.employee = decodedToken
        }else{
            return res.status(403).send('Access denied only employees can access')
        }
    }catch(err){
        return res.status(403).send('Access denied')
    }
    return next();
}

const adminAccess = (req,res,next) => {
    const accessToken = req.headers["employee"]
    try{
        const decodedToken = jwt.verify(accessToken, process.env.TOKEN_KEY)
        if(decodedToken.role == "admin"){
            req.employee = decodedToken
        }else{
            return res.status(403).send('Access denied only, admins can access')
        }
    }catch(err){
        return res.status(403).send('Access denied')
    }
    return next();
}

module.exports = {adminAccess, employeeAccess}