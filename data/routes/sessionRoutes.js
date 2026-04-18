import express from 'express';
import {
    getAllSessions,
    handleStartSession,
    terminateSession,
    deleteSession
} from '../controllers/sessionController.js';

const router = express.Router();

/**
 * @route   GET /api/sessions
 * @desc    Récupérer toutes les sessions (historique complet)
 */
router.get('/', getAllSessions);

/**
 * @route   POST /api/sessions/start
 * @desc    Démarrer une nouvelle session (création)
 */
router.post('/start', handleStartSession);

/**
 * @route   PUT /api/sessions/terminer/:id
 * @desc    Stopper le compteur de temps et enregistrer prix/volume
 * @note    Correction : On utilise directement la fonction importée
 */
router.put('/terminer/:id', terminateSession);

/**
 * @route   DELETE /api/sessions/:id
 * @desc    Supprimer une session de la base de données
 */
router.delete('/:id', deleteSession);

export default router;