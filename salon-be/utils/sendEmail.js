const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",        // <-- Replace with your Gmail
      pass: "your_app_password_here",     // <-- Use Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"Luxury Salon" <yourgmail@gmail.com>`, // <-- Replace with your Gmail
    to,
    subject,
    html: `
      <div style="font-family:Arial;line-height:1.6">
        <h3>${subject}</h3>
        <p>${message}</p>
        <br/>
        <p><b>Luxury Unisex Salon</b></p>
        <p>📞 +91 98765 43210</p>
      </div>
    `,
  });

  console.log(`Email sent to ${to}`);
};

module.exports = sendEmail;
