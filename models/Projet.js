const mongoose = require('mongoose')

const projetSchema = new mongoose.Schema({
  titre:        { type: String, required: true },
  description:  { type: String, required: true },
  technologies: { type: [String], default: [] },
  emoji:        { type: String, default: '🚀' },
  lien:         { type: String, default: '' },
  github:       { type: String, default: '' },
  image:        { type: String, default: '' },

}, { timestamps: true })

module.exports = mongoose.model('Projet', projetSchema)