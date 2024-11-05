const nodemailer = require("nodemailer");

const sendMailById = (mailId, options) => {
  // 设置邮箱配置
  const transporter = nodemailer.createTransport({
    // host: "smtp.example.com",
    service: "qq",
    port: 465,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "2457033735@qq.com",
      pass: "jwpkndromgnoebhj", //这里的密码不是你登录邮箱的密码，而是授权码
    },
  });

  //   设置收件人信息
  const mailOptions = {
    from: "2457033735@qq.com",
    to: mailId,
    subject: options?.subject || "邮箱验证码",
    html: options?.html || "<p>验证码是123123</p>",
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      // console.log("发送成功");
      // console.log(data.accepted);
      // console.log(data.response);
      resolve(data);
    });
  });
};

module.exports = {
  sendMailById,
};
