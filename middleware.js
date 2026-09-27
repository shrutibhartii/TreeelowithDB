const jwt=require("jsonwebtoken");
function authMiddleware(req,res,next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,"123attlasian");
    const userId=decoded.userId;
    if(userId)
    {
        req.userId=userId;//modify the req objectto add userid property
        next();
    }
    else{
        res.status(403).json({
            message:"token was incorrect"
        })
    }
    


}
module.exports={
    authMiddleware:authMiddleware
}

