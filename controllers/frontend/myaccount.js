const jwt = require('jsonwebtoken');
const checkStatus = require('../../public/js/checkstatus');

exports.myAccountPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;
    
        let url = `http://localhost:3000/api/user/${userId}`;

        myInit = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        let userInfo = await fetch(url, myInit);
        userInfo = await userInfo.json();

        let urlPartner = `http://localhost:3000/api/partner/container/${userId}`;

        let partnerInfo = await fetch(urlPartner, myInit);
        partnerInfo = await partnerInfo.json();

        res.render('pages/myaccount/myaccount', {userInfo, partnerInfo});

    } catch {
    res.status(401).json({ error: "Unauthenticated Request" });
    }
}

exports.myContainerPage = async (req, res) => { 
  try {
      const token = req.cookies["token"];
      let status = await checkStatus(token);
      status = status.userStatus;
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;
      let urlContainer= "";

      myInit = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      if (status == "partner") {
        console.log('partner')
        let url = `http://localhost:3000/api/partner/container/${userId}`;
        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        urlContainer = `http://localhost:3000/api/containerpartner/${partnerInfo._id}`;

      } else if( status == "member") {
        urlContainer = `http://localhost:3000/api/userContainer/${userId}`;
      }


      let containerInfo = await fetch(urlContainer, myInit);
      containerInfo = await containerInfo.json();

      res.render('pages/myaccount/mycontainer', {containerInfo});

  } catch {
  res.status(401).json({ error: "Unauthenticated Request" });
  }
}



exports.myHistoryPage = async (req, res) => { 
  try {
    
      const token = req.cookies["token"];
      let status = await checkStatus(token);
      status = status.userStatus;
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;
      let urlContainer= "";

      myInit = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      if (status == "partner") {
        let url = `http://localhost:3000/api/partner/container/${userId}`;
        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        urlHistory = `http://localhost:3000/api/history/partnerId/${partnerInfo._id}`;

      } else if( status == "member") {
        urlHistory = `http://localhost:3000/api/history/userId/${userId}`;
      }

      let historyInfo = await fetch(urlHistory, myInit);
      historyInfo = await historyInfo.json();

      historyInfo.forEach( history => {
        let date = history.date.split('T')[0].split('-');
        let dateString = `${date[2]}/${date[1]}/${date[0]}`;
        let hour = history.date.split("T")[1].slice(0,2);
        hour = parseInt(hour) + 1;
        let min = history.date.split("T")[1].slice(2,5);
        let time = `${hour}${min}`;

        history.date = `${dateString} - ${time}`;
      })


      res.render('pages/myaccount/myhistory', {historyInfo});

  } catch {
  res.status(401).json({ error: "Unauthenticated Request" });
  }
}
