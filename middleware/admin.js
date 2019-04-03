
module.exports = function(req, res, next) {            

    if (!req.user.isAdmin) return res.status(403).send({
        error: 'Forbidden', 
        error_description: 'You are not authorized to access this endpoint'
    });

    next();         
}