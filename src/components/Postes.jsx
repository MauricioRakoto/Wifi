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
            <div className="top d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                    <button onClick={() => setShowAddModal(true)} className="btn btn-session  d-flex align-items-center ">
                        <Plus size={18} /> Nouveau
                    </button>

                </div>
            </div>

            {/* --- TABLEAU DES DONNÉES --- */}
            <div className="data-session">
                {/* En-tête des colonnes (Masqué sur mobile) */}
                <div className="row sh infoh px-4 py-2 text-muted small fw-normal d-none d-md-flex  mb-2">
                    <div className="col-1 pr">
                        <h4 className="patl1">#</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Appareil</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Système</h4>
                    </div>
                    <div className="col"></div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-transparent"
                     style={{minHeight: '300px'}}>
                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
                             style={{height: '300px'}}>
                            <Loader2 size={40} className="text-primary spin mb-3"/>
                            <span className="text-muted fw-medium">Récupération des postes...</span>
                        </div>
                    ) : (
                        <div className="row sb">
                            {/* En-tête des colonnes (Masqué sur mobile) */}


                            {/* Liste des postes */}
                            {postes.length === 0 ? (
                                <div className="text-center py-5 text-muted bg-white rounded-4 shadow-sm">
                                    Aucun poste enregistré.
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2">
                                    {postes.map((poste, index) => (
                                        <div key={poste.id}
                                             className="row align-items-center mx-0 poste infob">
                                            {/* Index */}
                                            <div className="col-1 pr">
                                                <h6 className="text-muted small patl">{index + 1}</h6>
                                            </div>

                                            {/* Nom Appareil */}
                                            <div className="col pr">

                                                <h6 className="fw-bold text-dark patl">{poste.nom}</h6>

                                            </div>

                                            {/* Système */}
                                            <div className="col pr">
                                                <h6 className="patl text-secondary">{poste.systeme}</h6>
                                            </div>

                                            {/* Actions */}
                                            <div className="col">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        onClick={() => openLaunchModal(poste)}
                                                        className="btn btn-start"
                                                    >
                                                        <Play size={14} fill="currentColor"/>
                                                        <span>Démarrer</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeletePoste(poste.id)}
                                                        className="btn btn-standard"
                                                    >
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <style>{`
        .bg-light-hover:hover { background-color: #ffeef0 !important; color: #dc3545 !important; transition: 0.3s; }
        .hover-row { transition: transform 0.2s ease; border: 1px solid transparent; }
        .hover-row:hover { transform: scale(1.01); border-color: rgba(13, 110, 253, 0.1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
    `}</style>
                </div>
            </div>



            {/* --- MODAL : AJOUTER UN POSTE --- */}
            {showAddModal && (
                <div className="modal madd d-block">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content mc">
                            <form onSubmit={handleSavePoste}>
                                <div className="modal-header ">
                                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                        Nouveau Poste
                                    </h5>
                                    <button type="button" className=""
                                            onClick={() => setShowAddModal(false)}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-2">
                                        <label className="form-label fw-bold">
                                            <h4>Nom du poste </h4>
                                        </label>
                                        <input type="text" className="form-control rounded-3 py-2" required
                                               value={newPoste.nom}
                                               onChange={(e) => setNewPoste({...newPoste, nom: e.target.value})} placeholder="Entrez le nom..." />
                                    </div>
                                    <div className="row g-2">

                                        <label className="form-label small fw-bold">
                                            <h4>Type</h4>
                                        </label>
                                        <select className="form-select rounded-3 py-2" value={newPoste.type}
                                                onChange={(e) => setNewPoste({...newPoste, type: e.target.value})}>
                                            <option value="PC">Deskop</option>
                                            <option value="Laptop">Laptop</option>
                                            <option value="Laptop">Mobile</option>
                                            <option value="Laptop">Tablette</option>
                                        </select>

                                    </div>
                                    <div className="row g-2">
                                        <label className="form-label small fw-bold">
                                            <h4>Système d'exploitation</h4>
                                        </label>
                                        <input type="text" className="form-control rounded-3 py-2"
                                               value={newPoste.systeme}
                                               onChange={(e) => setNewPoste({...newPoste, systeme: e.target.value})}
                                               placeholder="Win 10, Linux..."/>
                                    </div>


                                </div>
                                <div className="modal-footer border-0">
                                    <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-bold">Terminer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL : LANCER LA SESSION --- */}
            {showLaunchModal && (
                <div className="modal d-block madd">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content mc border-0 shadow-lg rounded-4 overflow-hidden">
                            <form onSubmit={handleStartSession}>
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">Lancer la session
                                    </h5>
                                    <button type="button" className="" onClick={() => setShowLaunchModal(false)}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="modal-body p-4">
                                    <h5 className="text-muted small mb-4">Appareil : {selectedPoste?.nom}</h5>
                                    <div className="row g-2 times">
                                        {["15 Min", "30 Min", "45 Min", "90 Min", "1 Heure", "Libre"].map((label) => (
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
                                            <button style={{border: '0', background: '#4b1c71', color: '#ffffff'}} type="submit" className="btn btn-submit w-100 py-2 fw-bold" disabled={!selectedDuration}>
                                                Confirmer
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