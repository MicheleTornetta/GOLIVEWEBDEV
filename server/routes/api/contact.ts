
import { Request, Response } from "express";

import express from "express";
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const router = express.Router();

interface ContactRequest {
    name: string;
    company: string | null;
    email: string;
    phoneNumber: string | null;
    timeZone: 'est' | 'cst' | 'mst' | 'pst';
    preferredContactMethod: 'phone' | 'email' | 'any',
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
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', contactLimiter,
    (req: Request<any, any, ContactRequest>, res: Response<ContactResponse>) => {
        const { name, company, email, phoneNumber, subject, message, preferredContactMethod, timeZone } = req.body;

        if (!name || !email || !subject || !message || !preferredContactMethod || !timeZone) {
            res.status(400).send({
                error: 'Missing required field.'
            });
            return;
        }

        if (preferredContactMethod !== 'email' && preferredContactMethod !== 'phone' && preferredContactMethod !== 'any') {
            res.status(400).send({
                error: 'Invalid contact method.'
            });
            return;
        }

        if (preferredContactMethod === 'phone' && !phoneNumber) {
            res.status(400).send({
                error: 'Missing phone number - preferred contact method is by phone.'
            });
            return;
        }

        if (timeZone !== 'cst' && timeZone !== 'est' && timeZone !== 'mst' && timeZone != 'pst') {
            res.status(400).send({
                error: 'Invalid timezone.'
            });
            return;
        }

        const text =
            `From: ${name}
Email: ${email}
Company: ${company ?? 'NONE'}
${phoneNumber ? `Phone Number: ${phoneNumber}` : 'No Phone Number Provided.'}
Time Zone: ${timeZone}
Preferred Contact Method: ${preferredContactMethod}

${message}
`;

        const mailOptions = {
            from: 'contact.form@golivewebdev.com',
            to: process.env.SEND_TO_CONTACT_EMAIL_ACCOUNT,
            subject: 'GOLIVEWEBDEV: ' + subject,
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
                console.error(error);
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