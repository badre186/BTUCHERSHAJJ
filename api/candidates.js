import fs from 'fs';
import path from 'path';

// Définir le chemin du fichier JSON
const candidatesFilePath = path.join(process.cwd(), 'data', 'candidates.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Lire les données du fichier JSON
    try {
      const data = fs.readFileSync(candidatesFilePath, 'utf8');
      const candidates = JSON.parse(data || '[]');
      res.status(200).json(candidates);
    } catch (error) {
      res.status(500).json({ message: 'Erreur de lecture des données' });
    }
  } else if (req.method === 'POST') {
    // Ajouter de nouveaux candidats
    try {
      const newCandidates = req.body;
      fs.writeFileSync(candidatesFilePath, JSON.stringify(newCandidates, null, 2));
      res.status(200).json({ message: 'Données sauvegardées avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur de sauvegarde des données' });
    }
  } else {
    res.status(405).json({ message: 'Méthode HTTP non autorisée' });
  }
}