
const validateCashier = (req, res, next) => {
    if(req.user.type == 'staff' && !req.user.isAdmin){ next();
        }else{
        
        return res.status(403).json({
            "status": 403,
            "error": "You are Forbidden to view this page",
        })
    }
}

export default validateCashier;