let video = document.createElement("video");
let canvasElement = document.getElementById("canvas");
let canvas = canvasElement.getContext("2d");
let loadingMessage = document.getElementById("loadingMessage");
let informations = document.getElementById('informations');

let action = document.getElementById('action');
let partner = document.getElementById('partner');
let container = document.getElementById('container');

let info ="";

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}
// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});

async function tick() {
    loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
    
            info = code.data;
 
            try {

                let urlQrcode = `https://loopyourbox.herokuapp.com/api/qrcode/${info}`   
                myInit = {
                        method: "GET",
                        headers: {
                            'Authorization': 'Bearer ' + getCookie('token')
                        }
                    };
                    
                let qrcodeInfo = await fetch(urlQrcode , myInit);
                qrcodeInfo = await qrcodeInfo.json();
                    
                if (qrcodeInfo){
                    let urlContainer = `https://loopyourbox.herokuapp.com/api/container/${qrcodeInfo.containerId}`;
                    let containerInfo = await fetch(urlContainer);
                    containerInfo = await containerInfo.json();

                    let urlPartner = `https://loopyourbox.herokuapp.com/api/partner/${qrcodeInfo.partnerId}`;
                    let partnerInfo = await fetch(urlPartner);
                    partnerInfo = await partnerInfo.json();
                    
                    action.innerHTML = qrcodeInfo.action ;
                    partner.innerHTML = partnerInfo.name ;
                    container.innerHTML = `${containerInfo.name} ${containerInfo.credit} credits`;
                }else{
                    
                    informations.innerHTML = "Oooops, ce qrcode n'existe pas !!"
                }
                informations.hidden = false;
                canvasElement.hidden = true;

            } catch { 
                console.log('cant fetch Info')
            }

            cancelAnimationFrame(stream);
        } 
    }
    let stream = requestAnimationFrame(tick);
}

async function validation() {
    const token = getCookie("token");
    let url = `https://loopyourbox.herokuapp.com/api/history`
    myInit = {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          reference: info,
          token: token,
        })
    };

    try {
        
        let data = await fetch(url, myInit); 
        data = await data.json();
        
        //if save in history & and delete qrcode successful
        if (data) {
            if (data.hasOwnProperty('error')) {
                window.location.replace(`/`); //changer url quand pas assez de credit
            } else {
                window.location.replace(`/confirmation?ref=${data.reference}`);
            } 
        }
    } catch (e) {
        return e;
    }  
}


