const jwt=require('jsonwebtoken')

const ensureAuthenticated=(req,res,next)=>{
    const auth = req.headers['authorization']
    if(!auth){
        return res.status(400)
            .json({message:'Unauthorized ,Jwt token is required'})
    }
    try{
        const decoded = JsonWebTokenError.verify(auth,process.env.JWT_SECRET);
        req.user=decoded;
    } catch(err){
        return res.status(403)
            .json({messages:'Unauthorized,Jwt token wrong or expired'})
    }
}

module.exports=ensureAuthenticated;