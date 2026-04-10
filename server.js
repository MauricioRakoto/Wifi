import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration pour récupérer __dirname avec les ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'postes_enregistres.json');

// --- MIDDLEWARES ---
app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---

// Récupérer la liste des postes
app.get('/api/postes', (req, res) => {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// Ajouter un poste
app.post('/api/postes/ajouter', (req, res) => {
    const nouveauPoste = req.body;
    let postes = [];

    if (fs.existsSync(DATA_FILE)) {
        postes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    const posteAvecId = {
        id: Date.now(),
        ...nouveauPoste,
        dateAjout: new Date().toISOString()
    };

    postes.push(posteAvecId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(postes, null, 2));

    res.status(201).json({ message: "Poste ajouté", poste: posteAvecId });
});

// Supprimer un poste par ID
app.delete('/api/postes/:id', (req, res) => {
    const { id } = req.params;

    if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ message: "Fichier non trouvé" });

    let postes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const initialLength = postes.length;

    // On garde tous les postes SAUF celui qui a l'ID correspondant
    postes = postes.filter(p => p.id !== parseInt(id));

    if (postes.length === initialLength) {
        return res.status(404).json({ message: "Poste non trouvé" });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(postes, null, 2));
    res.json({ message: "Poste supprimé avec succès" });
});

// Scanner (Simulation)
app.get('/api/scanner', (req, res) => {
    res.json([
        { name: "PC-ADMIN", ip: "192.168.1.10", mac: "00:1A:2B:3C:4D:5E" },
        { name: "SAMSUNG-S24", ip: "192.168.1.15", mac: "AA:BB:CC:DD:EE:FF" }
    ]);
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});

app.post('/api/postes/ajouter', (req, res) => {
    const nouveauPoste = req.body;
    const filePath = './postes_enregistres.json';

    // Lire le fichier actuel ou créer un tableau vide
    let data = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        data = JSON.parse(fileContent);
    }

    // Ajouter le nouveau poste avec un ID et une date
    data.push({ ...nouveauPoste, id: Date.now(), dateAjout: new Date() });

    // Sauvegarder dans le fichier
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).send({ message: "Poste ajouté !" });
});