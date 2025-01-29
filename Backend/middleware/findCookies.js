import jwt from "jsonwebtoken";

export const  findCookies = async (req, res,next) =>{
  const {token} = req.cookies;

  try {
  if(!token){
    return res.json({sucess : false , message : "Not authorized , Login Again"})
  }
  
    const tokenDecode = jwt.verify(token , process.env.JWT_SECRET_TOKEN)
        
    if(tokenDecode.id){
      req.body.userId = tokenDecode.id;
    }else{
      return res.json({sucess : true , message : "Not authorized , Login Again"})
    }
    
    next();
  } catch (error) {
    return res.json({sucess : false , message : error.message})
  }
}