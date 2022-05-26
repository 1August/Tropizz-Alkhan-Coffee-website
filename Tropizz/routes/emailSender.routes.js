const {Router} = require('express')
const router = Router()

// Nodemailer API
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alxanm02@gmail.com',
        pass: 'ioedytzujhiyqbxm'
    }
})

// /api/emailSender/sendEmail
router.post(
    '/sendEmail',
    [],
    async (req, res) => {
        try {
            const {email, date, subject, text} = req.body

            const mailOptions = {
                from: 'boktaban@gmail.com',
                to: email,
                subject: subject,
                text: text,
                date: new Date(date)
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) res.status(500).json({message: `Error in emailSender.routes`})
                else console.log('Email sent: ' + info.response)
            })

            res.status(201).json('Message send.')
        } catch (e) {
            res.status(500).json({message: `Error in emailSender.routes`})
        }
    }
)

module.exports = router