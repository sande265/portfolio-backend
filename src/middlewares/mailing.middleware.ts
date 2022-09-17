import * as nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";
require("dotenv").config();

const mailParam: any = {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
    port: process.env.MAIL_PORT,
    host: process.env.MAIL_HOST
}

class MailTransporter {

}

interface mailTransport {
    (
        body: {
            days: string,
            from: string | number,
            to: string | number,
            description: string,
        },
        to: string,
        callback: Function
    ): MailTransporter
}

export const createMailTransport: mailTransport = async (body, to, callback) => {
    const transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
        host: mailParam.host,
        port: mailParam.port,
        secure: false,
        auth: {
            user: mailParam.user,
            pass: mailParam.password
        }
    })

    try {
        let result = await transport.sendMail({
            from: '"Sandesh Singh 📧" <sandesh.singh@geniussystems.com.np>',
            to: to,
            subject: "Leave Request",
            html: `
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <title>Leave Request</title>
                        <style>
                            body {
                                font-family: montserrat;
                                font-size: 14;
                                line-height: 1.5rem
                            }
                            .container {
                                display: block;
                                flex-direction: column;
                                width: 100%;
                            }
                            .item {
                                display: inline-block;
                                width: 100%;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="item">
                                <span>Applicant: Sandesh Singh</span>&nbsp;
                            </div>
                            <div class="item">
                                <span>Leave From: ${body.from}</span>&nbsp;
                            </div>
                            <div class="item">
                                <span>Leave To: ${body.to}</span>&nbsp;
                            </div>
                            <div class="item">
                                <span>Days: ${body.days}</span>&nbsp;
                            </div>
                            <div class="item">
                                <span>Remarks: ${body.description}</span>&nbsp;
                            </div>
                        </div>
                    </body>
                </html>
            `
        })
        callback(null, result);
    } catch (error) {
        callback(error);
    }

}