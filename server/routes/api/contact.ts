
import { Request, Response } from "express";

import express from "express";
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const router = express.Router();

interface ContactRequest {
    name: string;
    company: string;
    email: string;
    phoneNumber: string | null;
    subject: string;
    message: string;
}

interface ContactResponse {
    error?: string;
    success?: string;
}

const ONE_HOUR = 60 * 60 * 1000;

const contactLimiter = rateLimit({
    windowMs: ONE_HOUR,
    max: 20000,
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', contactLimiter,
    (req: Request<any, any, ContactRequest>, res: Response<ContactResponse>) => {
        const { name, company, email, phoneNumber, subject, message } = req.body;

        if (!name || !company || !email || !subject || !message) {
            res.status(400).send({
                error: 'Missing required field.'
            });
            return;
        }

        const text =
            `From: ${name}
Email: ${email}
Company: ${company}
${phoneNumber ? `Phone Number: ${phoneNumber}` : 'No Phone Number Provided.'}

${message}
`;

        const mailOptions = {
            from: 'contact.form@golivewebdev.com',
            to: 'cornchipgonecodin@gmail.com',
            subject,
            text
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CONTACT_EMAIL_ACCOUNT,
                pass: process.env.CONTACT_EMAIL_PASSWORD,
            }
        });


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send({
                    error: "Something went wrong."
                });
            } else {
                res.send({
                    success: 'Contact successfully submitted!'
                });
            }
        });
    });

export default router;