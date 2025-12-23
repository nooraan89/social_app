import nodemailer from "nodemailer";

 export const sendEmail=async({to,subjectType,html})=>{
console.log("hi")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.mail,
    pass: process.env.pass,

  },
});

// async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info =await transporter.sendMail({

    from: process.env.mail, // sender address
    to, // list of receivers
    subjectType, // Subject line
    html, // html body
  });
//return info.rejected==0?true:false;
  //console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

console.log(info);
}


export const subject={
rejister:"Active Account",
resetpassword:"reset password"
}
