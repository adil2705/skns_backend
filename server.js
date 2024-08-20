var express = require('express');
var nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config(); // Load environment variables from .env file
var app = express();
app.use(cors());

var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,  // Use environment variable
        pass: process.env.GMAIL_PASS
    },
    debug: true
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

function getEmailTemplate(name, user, phone, text) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                background-color: #007BFF;
                color: #ffffff;
                padding: 10px 20px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                text-align: center;
            }
            .email-header h1 {
                margin: 0;
                font-size: 24px;
            }
            .email-body {
                padding: 20px;
                color: #333333;
                line-height: 1.5;
            }
            .email-body h2 {
                color: #007BFF;
                margin-top: 0;
            }
            .email-footer {
                text-align: center;
                padding: 10px 20px;
                background-color: #f4f4f4;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                font-size: 12px;
                color: #999999;
            }
            .email-footer a {
                color: #007BFF;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Contact Form Submission</h1>
            </div>
            <div class="email-body">
                <h2>Hello,</h2>
                <p>You have received a new message from your Skns & sons contact form:</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; width: 30%;">Name:</td>
                        <td style="padding: 8px;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold; width: 30%;">Email:</td>
                        <td style="padding: 8px;">${user}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold; width: 30%;">Phone:</td>
                        <td style="padding: 8px;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold; width: 30%;">Message:</td>
                        <td style="padding: 8px;">${text}</td>
                    </tr>
                </table>
                <p>Best Regards,<br>Your Website Team</p>
            </div>
            <div class="email-footer">
                <p>This email was sent from your website's contact form. If you did not expect this email, please ignore it.</p>
                <p><a href="#">Unsubscribe</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
}




app.get('/send', function (req, res) {
    var mailOptions = {
        to: req.query.to,
        subject: 'Contact Form Message For Skns & Sons IT divison',
        from: `Contact Form Request <${req.query.user}>`,
        html: getEmailTemplate(req.query.name, req.query.user, req.query.phone, req.query.text) //function ko send kar ke template ko call kar rhe hai
    };

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (err, response) {
        if (err) {
            console.error("Error sending email:", err);
            res.end("error");
        } else {
            console.log("Message sent:", response);
            res.status(200).send("sent");
        }
    });
    
});

app.listen(8080, function (err) {
    if (err) {
        console.log("Error starting the server:", err);
    } else {
        console.log("Listening on port 8080");
    }
});
