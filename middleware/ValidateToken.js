import jsonwebtoken from 'jsonwebtoken';

const validateToken = async (req, res, next) => {
    try{
        const token = req.headers['x-access-token'];
        if(!token){
            return res.json({
            "status": 400,
            "error": "No Token provided"
        })}
        const decodedToken = await jsonwebtoken.verify(token, process.env.secret);
        if(!decodedToken){
            return res.json({
            "status": 400,
            "error": "Invalid Token"
        })}
        req.user = decodedToken;
        next();
    }
    catch(err){
        return res.status(400).json({
            "status": 400,
            "error": "Invalid Token"
        })
        console.log(err)
    }
}

export default validateToken;
    