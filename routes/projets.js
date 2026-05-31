const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const Project = require('../models/Projet')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'projects',
  allowedFormats: ['jpg', 'png', 'gif', 'jpeg', 'webp']
})
const upload = multer({ storage })

router.get('/', async (req, res) => {
  try {
    const projets = await Project.find().sort({ createdAt: -1 })
    res.json(projets)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.post('/', upload.single('image'), async (req, res) => {
  try {
     const data = {
      ...req.body,
      technologies: req.body.technologies.split(',').map(t => t.trim()),
      image: req.file ? req.file.path : ''
    }
    const projet = new Project(data)
    const sauvegarde = await projet.save()
    res.status(201).json(sauvegarde)
  } catch (err) {
    res.status(400).json({ message: 'Données invalides' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Projet supprimé' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router