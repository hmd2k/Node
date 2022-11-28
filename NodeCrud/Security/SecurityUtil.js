const jwt = require('jsonwebtoken')

const getCurrentUserId = (token) => {
    if(token){
        const decodedToken = jwt.decode(token,process.env.TOKEN_KEY)
    return decodedToken.employeeId;
    }else{
        res.sent('no access token')
    }
}

module.exports = getCurrentUserId