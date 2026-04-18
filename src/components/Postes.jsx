import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, RefreshCw, X, Play, Loader2 } from 'lucide-react';

const Postes = () => {
    // --- ÉTATS ---
    const [postes, setPostes] = useState([]);
    const [loading, setLoading] = useState(false);

    // États pour les Modaux
    const [showAddModal, setShowAddModal] = useState(false);
    const [showLaunchModal, setShowLaunchModal] = useState(false);

    // États pour les sélections
    const [selectedPoste, setSelectedPoste] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [newPoste, setNewPoste] = useState({ nom: '', type: 'PC', systeme: 'Windows 10' });

    const fetchPostes = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/postes');
            const data = await response.json();
            setPostes(data);
        } catch (err) {
            console.error("Erreur chargement postes");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => { fetchPostes(); }, []);

    const handleSavePoste = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/postes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPoste),
            });
            if (response.ok) {
                const created = await response.json();
                setPostes([...postes, created]);
                setShowAddModal(false);
                setNewPoste({ nom: '', type: 'PC', systeme: 'Windows 10' });
            }
        } catch (err) { alert("Erreur lors de l'enregistrement"); }
    };

    const handleStartSession = async (e) => {
        e.preventDefault();
        if (!selectedDuration || !selectedPoste) return;

        const maintenant = new Date();
        let heureFin = "Illimitée";
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

        if (selectedDuration !== "No Limite") {
            let minutes = (selectedDuration === "1 Heure") ? 60 : parseInt(selectedDuration);
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
            const response = await fetch('http://localhost:5000/api/sessions/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData),
            });
            if (response.ok) {
                alert(`Session lancée pour ${selectedPoste.nom}`);
                setShowLaunchModal(false);
            }
        } catch (err) { alert("Erreur lors du lancement"); }
    };

    const openLaunchModal = (poste) => {
        setSelectedPoste(poste);
        setSelectedDuration(null);
        setShowLaunchModal(true);
    };

    const handleDeletePoste = async (id) => {
        if (window.confirm("Supprimer ce poste ?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/postes/${id}`, { method: 'DELETE' });
                if (response.ok) setPostes(postes.filter(poste => poste.id !== id));
            } catch (err) { console.error("Erreur suppression"); }
        }
    };

    return (
        <div className="p-2">
            {/* EN-TÊTE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                    <button onClick={() => setShowAddModal(true)} className="btn btn-primary rounded-3 d-flex align-items-center gap-2 shadow-sm">
                        <Plus size={18} /> Nouveau Poste
                    </button>
                    <button onClick={fetchPostes} className="btn btn-outline-secondary rounded-3">
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ minHeight: '300px' }}>
                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1" style={{ height: '300px' }}>
                        <Loader2 size={40} className="text-primary spin mb-3" />
                        <span className="text-muted fw-medium">Récupération des postes...</span>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="bg-light small">
                            <tr>
                                <th className="px-4 py-3 border-0">Appareil</th>
                                <th className="border-0">Système</th>
                                <th className="text-end px-4 border-0">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {postes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-5 text-muted">Aucun poste enregistré.</td>
                                </tr>
                            ) : (
                                postes.map((poste) => (
                                    <tr key={poste.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="p-2 bg-light rounded-2 text-primary"><Monitor size={16} /></div>
                                                <span className="fw-bold text-dark">{poste.nom}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted small">{poste.systeme}</td>
                                        <td className="text-end px-4">
                                            <button onClick={() => openLaunchModal(poste)} className="btn btn-success btn-sm rounded-3 px-3 me-2 border-0">
                                                <Play size={14} className="me-1" fill="currentColor" /> Démarrer
                                            </button>
                                            <button onClick={() => handleDeletePoste(poste.id)} className="btn btn-outline-danger btn-sm rounded-3 border-0 bg-light-hover">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- MODAL : AJOUTER UN POSTE --- */}
            {showAddModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <form onSubmit={handleSavePoste}>
                                <div className="modal-header bg-primary text-white border-0 py-3">
                                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                        <Plus size={20}/> Nouveau Poste
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Nom du poste (Ex: PC-01)</label>
                                        <input type="text" className="form-control rounded-3 py-2" required value={newPoste.nom} onChange={(e) => setNewPoste({...newPoste, nom: e.target.value})} placeholder="Entrez le nom..." />
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Type</label>
                                            <select className="form-select rounded-3 py-2" value={newPoste.type} onChange={(e) => setNewPoste({...newPoste, type: e.target.value})}>
                                                <option value="PC">PC Fixe</option>
                                                <option value="Laptop">Laptop</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Système d'exploitation</label>
                                            <input type="text" className="form-control rounded-3 py-2" value={newPoste.systeme} onChange={(e) => setNewPoste({...newPoste, systeme: e.target.value})} placeholder="Win 10, Linux..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-3">
                                    <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-bold">Enregistrer le poste</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL : LANCER LA SESSION --- */}
            {showLaunchModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <form onSubmit={handleStartSession}>
                                <div className="bg-success p-3 text-white d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                        <Play size={20} fill="currentColor"/> Lancer la session
                                    </h5>
                                    <button type="button" className="btn text-white p-0 border-0" onClick={() => setShowLaunchModal(false)}>
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="modal-body p-4 text-center">
                                    <p className="text-muted small mb-4">Poste : <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold">{selectedPoste?.nom}</span></p>
                                    <div className="row g-2">
                                        {["15 Min", "30 Min", "45 Min", "90 Min", "1 Heure", "No Limite"].map((label) => (
                                            <div className="col-4" key={label}>
                                                <button
                                                    type="button"
                                                    className={`btn w-100 py-3 rounded-3 fw-bold small transition-all ${selectedDuration === label ? 'btn-success text-white shadow' : 'btn-outline-success border-2'}`}
                                                    onClick={() => setSelectedDuration(label)}
                                                >
                                                    {label}
                                                </button>
                                            </div>
                                        ))}
                                        <div className="col-12 mt-4">
                                            <button type="submit" className="btn btn-dark w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={!selectedDuration}>
                                                CONFIRMER LE LANCEMENT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .bg-light-hover:hover { background-color: #f8f9fa !important; color: #dc3545 !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
            `}</style>
        </div>
    );
};

export default Postes;