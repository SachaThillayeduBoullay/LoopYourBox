const jwt = require('jsonwebtoken');

module.exports = 
    async function checkStatus(token) {
        try{
            const decodedToken = jwt.verify(token, process.env.JWT_PW)
            const userId = decodedToken.userId;
            let url = `${process.env.DOMAIN}/api/user/${userId}`;

            myInit = {
                headers: {
                    Authorization: "Bearer " + token,
                },
            };

            let userInfo = await fetch(url, myInit);
            userInfo = await userInfo.json();

            let info = {userStatus: userInfo.status};

            if (userInfo.status === "partner"){
                let urlPartner = `${process.env.DOMAIN}/api/partner/container/${userId}`;

                let partnerInfo = await fetch(urlPartner);
                partnerInfo = await partnerInfo.json();
                
                if(partnerInfo) {
                    info.partnerId = partnerInfo._id;
                }
            }
            
            return info;
        } catch{
            throw new Error({error: `Can't get status`});
        }
    }



