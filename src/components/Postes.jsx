import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Plus, Trash2, Play, Database, X } from 'lucide-react';

const Postes = () => {
    // --- ÉTATS ---
    const [savedDevices, setSavedDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    // États pour les Modaux
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLaunchModal, setShowLaunchModal] = useState(false);

    // États pour la sélection et le formulaire
    const [selectedPoste, setSelectedPoste] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [newPoste, setNewPoste] = useState({ nom: '', type: 'PC', systeme: 'Windows' });

    // --- LOGIQUE DE RÉCUPÉRATION ---
    const fetchPostes = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/postes');
            const data = await response.json();
            setSavedDevices(data);
        } catch (err) {
            console.error("Erreur de chargement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPostes(); }, []);

    // --- LOGIQUE D'ENREGISTREMENT ---
    const handleSavePoste = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/postes/ajouter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPoste),
            });
            if (response.ok) {
                setShowAddModal(false);
                setNewPoste({ nom: '', type: 'PC', systeme: 'Windows' });
                fetchPostes();
            }
        } catch (err) { alert("Erreur lors de l'enregistrement"); }
    };

    // --- LOGIQUE DE LANCEMENT (SUBMIT) ---
    const handleStartSession = async (e) => {
        e.preventDefault();
        if (!selectedDuration || !selectedPoste) return;

        const maintenant = new Date();
        let heureFin = "Illimitée";

        // Correction des options de formatage : "2-digit" au lieu de "2h"
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Force le format 24h pour éviter les erreurs AM/PM
        };

        // Calcul de l'heure de fin si ce n'est pas "No Limite"
        if (selectedDuration !== "No Limite") {
            const minutes = parseInt(selectedDuration);
            const finDate = new Date(maintenant.getTime() + minutes * 60000);
            heureFin = finDate.toLocaleTimeString([], timeOptions);
        }

        const sessionData = {
            nomAppareil: selectedPoste.nom,
            typeAppareil: selectedPoste.type,
            systeme: selectedPoste.systeme,
            dateUtiliser: maintenant.toLocaleDateString(),
            debutHeure: maintenant.toLocaleTimeString([], timeOptions),
            finHeure: heureFin,
            status: 'En cours'
        };

        try {
            const response = await fetch('http://localhost:5000/api/sessions/demarrer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData),
            });

            if (response.ok) {
                alert(`Session lancée pour ${selectedPoste.nom}. Fin à ${heureFin}`);
                setShowLaunchModal(false);
                setSelectedDuration(null);
                // Optionnel : rafraîchir la liste si nécessaire
            }
        } catch (err) {
            alert("Erreur lors du lancement de la session");
        }
    };

    const handleSupprimer = async (id) => {
        if (window.confirm("Supprimer ce poste ?")) {
            await fetch(`http://localhost:5000/api/postes/${id}`, { method: 'DELETE' });
            fetchPostes();
        }
    };

    return (
        <div className="p-2">
            {/* EN-TÊTE DE PAGE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Gestion des Postes</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-3 px-3" onClick={() => setShowAddModal(true)}>
                        <Plus size={18} className="me-1" /> Ajouter un poste
                    </button>
                    <button onClick={fetchPostes} className="btn btn-outline-secondary rounded-3">
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* TABLEAU DES POSTES */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 border-0 small text-muted text-uppercase">Appareil</th>
                            <th className="py-3 border-0 small text-muted text-uppercase">Système</th>
                            <th className="py-3 border-0 small text-muted text-uppercase text-end px-4">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savedDevices.map((poste) => (
                            <tr key={poste.id}>
                                <td className="px-4 py-3 fw-bold text-dark">
                                    <div className="d-flex align-items-center gap-3">
                                        <Monitor size={20} className="text-primary" />
                                        {poste.nom}
                                    </div>
                                </td>
                                <td className="py-3 text-secondary">{poste.systeme} ({poste.type})</td>
                                <td className="py-3 text-end px-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-success btn-sm rounded-3 px-3"
                                            onClick={() => { setSelectedPoste(poste); setShowLaunchModal(true); }}
                                        >
                                            <Play size={14} fill="currentColor" className="me-1" /> Lancer
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm rounded-3" onClick={() => handleSupprimer(poste.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL : LANCER L'UTILISATION (SUBMIT) */}
            {showLaunchModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <form onSubmit={handleStartSession}>
                                <div className="bg-success p-3 text-white d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold m-0">Lancer l'utilisation</h5>
                                    <button type="button" className="btn text-white p-0 border-0" onClick={() => setShowLaunchModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="modal-body p-4 text-center">
                                    <p className="text-muted small mb-4">Poste : <strong>{selectedPoste?.nom}</strong></p>
                                    <div className="row g-3">
                                        {["15 Min", "30 Min", "45 Min", "90 Min", "1 Heure", "No Limite"].map((label) => (
                                            <div className="col-4" key={label}>
                                                <button
                                                    type="button"
                                                    className={`btn w-100 py-3 rounded-3 fw-bold ${selectedDuration === label ? 'btn-success text-white shadow' : 'btn-outline-success'}`}
                                                    onClick={() => setSelectedDuration(label)}
                                                >
                                                    {label}
                                                </button>
                                            </div>
                                        ))}

                                        <div className="col-12 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-dark w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                                disabled={!selectedDuration}
                                            >
                                                <Play size={18} fill="currentColor" /> Lancer la session
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL : AJOUTER UN POSTE (Identique) */}
            {showAddModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <form onSubmit={handleSavePoste}>
                                <div className="modal-header bg-primary text-white border-0">
                                    <h5 className="modal-title fw-bold">Nouveau Poste</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Nom</label>
                                        <input type="text" className="form-control" required value={newPoste.nom} onChange={(e) => setNewPoste({...newPoste, nom: e.target.value})} />
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Type</label>
                                            <select className="form-select" value={newPoste.type} onChange={(e) => setNewPoste({...newPoste, type: e.target.value})}>
                                                <option value="PC">PC Fixe</option>
                                                <option value="Laptop">Laptop</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">OS</label>
                                            <input type="text" className="form-control" value={newPoste.systeme} onChange={(e) => setNewPoste({...newPoste, systeme: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-3">
                                    <button type="submit" className="btn btn-primary w-100 rounded-3 py-2">Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                   .spin { animation: spin 1s linear infinite; } `}
            </style>
        </div>
    );
};

export default Postes;