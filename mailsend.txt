const nodemailer = require('nodemailer');

const transoperter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user:'cococat872024@gmail.com',
            pass:'tdmqtabofqjzvhot',
        }
    }
);

function sendMail(to,sub,msg){
    transoperter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });
    console.log("Email Send");
}

sendMail("karwit2544@gmail.com","this is test","text test")