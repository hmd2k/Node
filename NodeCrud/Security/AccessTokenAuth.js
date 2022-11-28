const jwt = require('jsonwebtoken')

const verifyAccessToken = (req, res, next)=>{
    const accessToken = req.headers["employee"];
    if(!accessToken){
        return res.status(403).send("Not Authenticated")
    }
    const tok = jwt.decode(accessToken, process.env.TOKEN_KEY)
        if(tok.purpose!= "ACCESS_TOKEN"){
            res.status(401).send("refresh token is used, use access token")
        }
    try{
        const decodedToken = jwt.verify(accessToken, process.env.TOKEN_KEY)
        req.employee = decodedToken
    }catch(err){
        return res.status(401).send("Invalid token")
    }
    return next();  
};

module.exports  = verifyAccessToken;