const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Project = require('../models/Projet')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
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
      image: req.file ? `/uploads/${req.file.filename}` : ''
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