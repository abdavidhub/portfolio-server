const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post('/', async (req, res) => {
  const { nom, email, message } = req.body

  if (!nom || !email || !message) {
    return res.status(400).json({ message: 'Champs manquants.' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nouveau message de ${nom}`,
      html: `
        <h2>Message de ${nom}</h2>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `,
    })

    res.json({ message: 'Message envoyé !' })
  } catch (err) {
    console.error('Erreur email:', err)
    res.status(500).json({ message: 'Erreur envoi email.' })
  }
})

module.exports = router