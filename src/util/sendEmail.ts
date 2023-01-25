import nodemailer from 'nodemailer';

const sendEmail = async (email:string, subject:string, text:string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            secure: true,
            auth: {
                user: 'promenergo.typography@gmail.com',
                pass: 'caueqicjetbzxvgt',
            },
        });

        await transporter.sendMail({
            from: 'promenergo.typography@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent successfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;
