const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PW)
        const userId = decodedToken.userId;

        let url = `http://localhost:3000/api/user/${userId}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };  

        let userInfo = await fetch(url, myInit);
        userInfo = await userInfo.json();

        if (!userInfo || userInfo.status != 'admin' ) {
            throw `Ce membre n'existe pas administrateur`;
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request')
        });
    }
};