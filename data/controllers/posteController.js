import { readData, saveData, POSTES_FILE } from '../models/dataHandler.js';

export const getAllPostes = (req, res) => {
    const postes = readData(POSTES_FILE);
    res.json(postes);
};

export const createPoste = (req, res) => {
    const postes = readData(POSTES_FILE);
    const nouveauPoste = { id: Date.now(), ...req.body, status: "Disponible" };
    postes.push(nouveauPoste);
    saveData(POSTES_FILE, postes);
    res.status(201).json(nouveauPoste);
};

export const deletePoste = (req, res) => {
    let postes = readData(POSTES_FILE);
    postes = postes.filter(p => p.id !== parseInt(req.params.id));
    saveData(POSTES_FILE, postes);
    res.json({ message: "Poste supprimé" });
};