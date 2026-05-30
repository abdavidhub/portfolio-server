process.env.NODE_ENV = process.env.NODE_ENV || 'production'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const projectRoutes = require('./routes/projets')
const contactRoutes = require('./routes/contact')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté')
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message)
  })