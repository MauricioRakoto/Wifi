import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Plus, Trash2, Play, Database } from 'lucide-react';

const Postes = () => {
    // 1. États pour stocker les données et gérer l'interface
    const [savedDevices, setSavedDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // État du formulaire pour un nouveau poste
    const [newPoste, setNewPoste] = useState({
        nom: '',
        type: 'PC',
        systeme: 'Windows'
    });

    // 2. FONCTION : Récupérer les postes depuis le fichier JSON (via le serveur)
    const fetchPostesEnregistres = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/postes');
            if (!response.ok) throw new Error("Erreur serveur");
            const data = await response.json();
            setSavedDevices(data);
        } catch (err) {
            setError("Impossible de charger les données. Vérifiez que le serveur est lancé.");
        } finally {
            setLoading(false);
        }
    };

    // 3. FONCTION : Enregistrer un nouveau poste
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/postes/ajouter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPoste),
            });

            if (response.ok) {
                setShowModal(false); // Fermer le modal
                setNewPoste({ nom: '', type: 'PC', systeme: 'Windows' }); // Reset formulaire
                fetchPostesEnregistres(); // Rafraîchir la liste immédiatement
            }
        } catch (err) {
            alert("Erreur lors de l'enregistrement.");
        }
    };

    // 4. FONCTION : Supprimer un poste enregistré
    const handleSupprimer = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce poste de l'inventaire ?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/postes/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    // Mise à jour de l'état local pour faire disparaître la ligne sans recharger
                    setSavedDevices(savedDevices.filter(p => p.id !== id));
                }
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    // Charger les postes dès que le composant s'affiche
    useEffect(() => {
        fetchPostesEnregistres();
    }, []);

    return (
        <div className="p-2">
            {/* EN-TÊTE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark m-0">Gestion de l'Inventaire</h2>
                    <p className="text-muted small">Postes configurés dans le fichier de base de données.</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 px-3"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus size={18} /> Nouveau Poste
                    </button>
                    <button onClick={fetchPostesEnregistres} className="btn btn-outline-secondary rounded-3">
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* TABLEAU */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 border-0 text-muted small uppercase">Nom du Poste</th>
                            <th className="py-3 border-0 text-muted small uppercase">Type</th>
                            <th className="py-3 border-0 text-muted small uppercase">OS</th>
                            <th className="py-3 border-0 text-muted small uppercase text-end px-4">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savedDevices.length > 0 ? (
                            savedDevices.map((poste) => (
                                <tr key={poste.id}>
                                    <td className="px-4 py-3 fw-bold">
                                        <div className="d-flex align-items-center gap-3">
                                            <Monitor size={20} className="text-primary" />
                                            {poste.nom}
                                        </div>
                                    </td>
                                    <td className="py-3">{poste.type}</td>
                                    <td className="py-3">
                                            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                                                {poste.systeme}
                                            </span>
                                    </td>
                                    <td className="py-3 text-end px-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-success btn-sm rounded-3 px-3">
                                                <Play size={14} fill="currentColor" className="me-1" /> Lancer
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-3 px-2"
                                                onClick={() => handleSupprimer(poste.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">
                                    <Database size={40} className="mb-2 opacity-25" /><br/>
                                    {loading ? "Chargement..." : "Aucun poste enregistré."}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL (Ajout de poste) */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header bg-primary text-white border-0 py-3">
                                <h5 className="modal-title fw-bold">Ajouter un nouveau poste</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Nom de l'appareil</label>
                                        <input
                                            type="text" className="form-control rounded-3" required
                                            value={newPoste.nom} onChange={(e) => setNewPoste({...newPoste, nom: e.target.value})}
                                            placeholder="Ex: PC-SALLE-01"
                                        />
                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Type</label>
                                            <select className="form-select rounded-3" value={newPoste.type} onChange={(e) => setNewPoste({...newPoste, type: e.target.value})}>
                                                <option value="PC">PC Fixe</option>
                                                <option value="Laptop">Laptop</option>
                                                <option value="Smartphone">Smartphone</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Système</label>
                                            <input
                                                type="text" className="form-control rounded-3"
                                                value={newPoste.systeme} onChange={(e) => setNewPoste({...newPoste, systeme: e.target.value})}
                                                placeholder="Windows 11"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn btn-primary rounded-3 px-4 fw-bold">Enregistrer le poste</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spin { animation: spin 1s linear infinite; }
                    .table-hover tbody tr:hover { background-color: rgba(13, 110, 253, 0.02); }
                `}
            </style>
        </div>
    );
};

export default Postes;