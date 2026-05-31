const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const Project = require('../models/Project')

const getUpload = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  })

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'portfolio',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
  })

  return multer({ storage })
}

router.get('/', async (req, res) => {
  try {
    const projets = await Project.find().sort({ createdAt: -1 })
    res.json(projets)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.post('/', (req, res) => {
  const upload = getUpload()
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err)
      return res.status(500).json({ message: 'Erreur upload' })
    }
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
      console.error('DB error:', err)
      res.status(400).json({ message: 'Données invalides' })
    }
  })
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