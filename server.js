import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const POSTES_FILE = path.join(__dirname, 'postes.json');
const SESSIONS_FILE = path.join(__dirname, 'sessions_actives.json');

// --- FONCTIONS UTILITAIRES ---
const readData = (file) => {
    try {
        if (!fs.existsSync(file)) return [];
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error(`Erreur de lecture sur ${file}:`, error);
        return [];
    }
};

const saveData = (file, data) => {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Erreur d'écriture sur ${file}:`, error);
    }
};

// --- ROUTES POSTES ---
app.get('/api/postes', (req, res) => {
    res.json(readData(POSTES_FILE));
});

// --- ROUTES SESSIONS ---

/**
 * 1. RÉCUPÉRER TOUTES LES SESSIONS (C'est cette route dont Utiliser.jsx a besoin)
 */
app.get('/api/sessions', (req, res) => {
    try {
        const sessions = readData(SESSIONS_FILE);
        // On renvoie les sessions triées par la plus récente en premier
        const sessionsTriees = sessions.sort((a, b) => b.id - a.id);
        res.json(sessionsTriees);
    } catch (error) {
        res.status(500).json({ error: "Impossible de récupérer les sessions" });
    }
});

/**
 * 2. ENREGISTRER UNE NOUVELLE SESSION
 */
app.post('/api/sessions/demarrer', (req, res) => {
    try {
        const sessions = readData(SESSIONS_FILE);
        const nouvelleSession = {
            id: Date.now(),
            ...req.body,
            status: 'En cours', // On force le statut au démarrage
            timestamp_systeme: new Date().toISOString()
        };

        sessions.push(nouvelleSession);
        saveData(SESSIONS_FILE, sessions);

        console.log(`[SESSION] Poste ${nouvelleSession.nomAppareil} activé.`);
        res.status(201).json(nouvelleSession);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du démarrage" });
    }
});

/**
 * 3. TERMINER UNE SESSION (Optionnel mais recommandé)
 */
app.put('/api/sessions/terminer/:id', (req, res) => {
    try {
        let sessions = readData(SESSIONS_FILE);
        sessions = sessions.map(s =>
            s.id === parseInt(req.params.id) ? { ...s, status: 'Terminé' } : s
        );
        saveData(SESSIONS_FILE, sessions);
        res.json({ message: "Session terminée" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la fermeture" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur de gestion Wi-Fi sur http://localhost:${PORT}`);
});

// Supprimer une session de l'historique
app.delete('/api/sessions/:id', (req, res) => {
    try {
        let sessions = readData(SESSIONS_FILE);
        const initialLength = sessions.length;

        // On filtre pour garder tout sauf l'ID concerné
        sessions = sessions.filter(s => s.id !== parseInt(req.params.id));

        if (sessions.length === initialLength) {
            return res.status(404).json({ error: "Session non trouvée" });
        }

        saveData(SESSIONS_FILE, sessions);
        res.json({ message: "Session supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
});

// Route pour stopper le compteur (terminer la session)
app.put('/api/sessions/terminer/:id', (req, res) => {
    try {
        let sessions = readData(SESSIONS_FILE);
        const index = sessions.findIndex(s => s.id === parseInt(req.params.id));

        if (index !== -1) {
            // On change le statut pour arrêter le compteur
            sessions[index].status = "Terminé";

            // On enregistre l'heure exacte de l'arrêt
            sessions[index].finHeureReelle = new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            saveData(SESSIONS_FILE, sessions);
            res.json({ message: "Compteur stoppé", session: sessions[index] });
        } else {
            res.status(404).json({ error: "Session non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});