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
 * Démarre une nouvelle session
 */
export const handleStartSession = (req, res) => {
    try {
        const sessions = readData(SESSIONS_FILE);
        const { nomAppareil, debutHeure, finHeure, dureeSelectionnee } = req.body;

        if (!nomAppareil || !debutHeure) {
            return res.status(400).json({ error: "Données manquantes" });
        }

        const nouvelleSession = {
            id: Date.now(), // ID unique basé sur le timestamp
            nomAppareil,
            debutHeure,
            finHeure: finHeure || "Illimitée",
            dureeSelectionnee: dureeSelectionnee || "Libre",
            status: "En cours",
            // On initialise les valeurs de fin à vide ou 0
            prixTotal: 0,
            volumeTotal: "0.000",
            createdAt: new Date().toISOString()
        };

        sessions.push(nouvelleSession);
        saveData(SESSIONS_FILE, sessions);

        res.status(201).json(nouvelleSession);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du démarrage" });
    }
};

/**
 * Terminer une session (Celle appelée par handleTerminate du Frontend)
 */
export const terminateSession = (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        let sessions = readData(SESSIONS_FILE);

        // Utilisation de == pour comparer string (params) et number (id)
        const index = sessions.findIndex(s => s.id == id);

        if (index !== -1) {
            // Mise à jour de la session avec les calculs envoyés par le front
            sessions[index] = {
                ...sessions[index],
                ...updateData,
                status: 'Terminé'
            };

            saveData(SESSIONS_FILE, sessions);
            return res.status(200).json({ message: "Session terminée et enregistrée" });
        }

        res.status(404).json({ message: "Session non trouvée" });
    } catch (error) {
        console.error("Erreur terminateSession:", error);
        res.status(500).json({ error: "Erreur technique lors de la clôture" });
    }
};

/**
 * Supprime une session
 */
export const deleteSession = (req, res) => {
    try {
        let sessions = readData(SESSIONS_FILE);
        const id = req.params.id;

        const filteredSessions = sessions.filter(s => s.id != id);
        saveData(SESSIONS_FILE, filteredSessions);

        res.json({ message: "Session supprimée" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};