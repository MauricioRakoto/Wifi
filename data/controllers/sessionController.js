import { readData, saveData, SESSIONS_FILE } from '../models/dataHandler.js';

/**
 * Récupère toutes les sessions enregistrées
 */
export const getAllSessions = (req, res) => {
    try {
        const sessions = readData(SESSIONS_FILE);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des sessions" });
    }
};

/**
 * MÉTHODE : handleStartSession
 * Crée et démarre une nouvelle session pour un poste
 */
export const handleStartSession = (req, res) => {
    try {
        const sessions = readData(SESSIONS_FILE);
        const { nomAppareil, debutHeure, finHeure, dureeSelectionnee } = req.body;

        // Validation simple
        if (!nomAppareil || !debutHeure) {
            return res.status(400).json({ error: "Données manquantes pour démarrer la session" });
        }

        const nouvelleSession = {
            id: Date.now(),
            nomAppareil,
            debutHeure,
            finHeure: finHeure || "Illimitée",
            dureeSelectionnee: dureeSelectionnee || "Libre",
            status: "En cours",
            dateUtiliser: new Date().toLocaleDateString('fr-FR')
        };

        sessions.push(nouvelleSession);
        saveData(SESSIONS_FILE, sessions);

        res.status(201).json(nouvelleSession);
    } catch (error) {
        console.error("Erreur startSession:", error);
        res.status(500).json({ error: "Erreur interne lors du démarrage" });
    }
};

/**
 * MÉTHODE : terminateSession
 * Arrête le compteur en changeant le statut à "Terminé"
 */
export const terminateSession = (req, res) => {
    try {
        let sessions = readData(SESSIONS_FILE);
        const id = parseInt(req.params.id);
        const index = sessions.findIndex(s => s.id === id);

        if (index !== -1) {
            sessions[index].status = "Terminé";
            // On enregistre l'heure réelle de fin
            sessions[index].finHeureReelle = new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            saveData(SESSIONS_FILE, sessions);
            res.json({ message: "Compteur arrêté", session: sessions[index] });
        } else {
            res.status(404).json({ error: "Session non trouvée" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'arrêt de la session" });
    }
};

/**
 * Supprime une session de l'historique
 */
export const deleteSession = (req, res) => {
    try {
        let sessions = readData(SESSIONS_FILE);
        const id = parseInt(req.params.id);

        const filteredSessions = sessions.filter(s => s.id !== id);
        saveData(SESSIONS_FILE, filteredSessions);

        res.json({ message: "Session supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};