import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Power, Trash2, Loader2, Database } from 'lucide-react';

const Utiliser = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempsActuel, setTempsActuel] = useState(new Date());

    // Horloge interne pour les calculs en temps réel (Prix et Volume)
    useEffect(() => {
        const timer = setInterval(() => { setTempsActuel(new Date()); }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Lecture des sessions (VUE -> CONTROLLER)
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/sessions');
            const data = await response.json();
            // On ne gère ici que l'affichage des sessions "En cours"
            setSessions(data.filter(s => s.status === 'En cours'));
        } catch (err) {
            console.error("Erreur de chargement des sessions");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => { fetchSessions(); }, []);

    // --- FONCTIONALITÉ : CALCUL DU VOLUME GLOBAL DU PARC ---
    const calculerVolumeGlobal = () => {
        const totalMo = sessions.reduce((acc, session) => {
            const [h, m] = session.debutHeure.split(':').map(Number);
            const debut = new Date(); debut.setHours(h, m, 0);
            let diffMs = tempsActuel - debut;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            return acc + (Math.floor(diffMs / 60000) * 1.5);
        }, 0);

        return totalMo >= 1024
            ? `${(totalMo / 1024).toFixed(2)} Go`
            : `${totalMo.toFixed(1)} Mo`;
    };

    // --- MÉTHODE MISE À JOUR : handleTerminate (MVC READY) ---
    const handleTerminate = async (id, session) => {
        if (window.confirm(`Arrêter la session sur ${session.nomAppareil} ?`)) {
            const maintenant = new Date();

            // Calcul final pour le stockage JSON
            const [hDebut, mDebut] = session.debutHeure.split(':').map(Number);
            const debutDate = new Date();
            debutDate.setHours(hDebut, mDebut, 0);

            let diffMs = maintenant - debutDate;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            const minutesConsommees = Math.floor(diffMs / 60000);

            const prixFinal = minutesConsommees * 35;
            const volumeMo = minutesConsommees * 1.5;
            const volumeGo = (volumeMo / 1024).toFixed(3); // On stocke en Go pour le composant Stats

            // Objet conforme au Modèle attendu par le Controller
            const sessionUpdate = {
                status: 'Terminé',
                finHeure: maintenant.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                dureeMinutes: minutesConsommees,
                prixTotal: prixFinal,
                volumeTotal: volumeGo,
                createdAt: maintenant.toISOString() // Crucial pour le filtrage par date dans Stats
            };

            try {
                // Appel au Contrôleur via la route API
                const response = await fetch(`http://localhost:5000/api/sessions/terminer/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionUpdate),
                });

                if (response.ok) {
                    setSessions(sessions.filter(s => s.id !== id));
                } else {
                    alert("Erreur lors de l'enregistrement de la session.");
                }
            } catch (err) {
                console.error("Erreur réseau :", err);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer définitivement cette session ?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/sessions/${id}`, { method: 'DELETE' });
                if (response.ok) setSessions(sessions.filter(s => s.id !== id));
            } catch (err) { console.error("Erreur suppression"); }
        }
    };

    const calculerDureeDynamique = (session) => {
        const [h, m] = session.debutHeure.split(':').map(Number);
        const debut = new Date(); debut.setHours(h, m, 0);
        let diffMs = tempsActuel - debut;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
        const totalSec = Math.floor(diffMs / 1000);

        if (session.finHeure === "Illimitée") {
            return `${Math.floor(totalSec / 3600)}h ${Math.floor((totalSec % 3600) / 60)}m ${totalSec % 60}s`;
        } else {
            const [hf, mf] = session.finHeure.split(':').map(Number);
            const fin = new Date(); fin.setHours(hf, mf, 0);
            let resteMs = fin - tempsActuel;
            if (resteMs <= 0) return "Terminé";
            return `${Math.floor(resteMs / 3600000)}h ${Math.floor((resteMs % 3600000) / 60000)}m ${Math.floor((resteMs % 60000) / 1000)}s`;
        }
    };

    return (
        <div className="p-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                    {/* Badge Volume Global en temps réel */}
                    <div className="d-flex align-items-center px-3 rounded-3 shadow-sm">
                        <Database size={16} className="me-2"/> Réseau : {calculerVolumeGlobal()}
                    </div>
                    <div className="bg-opacity-10  d-flex align-items-center px-3 rounded-3 shadow-sm">
                        {sessions.length} Poste(s) en ligne
                    </div>
                    <button onClick={fetchSessions} className="btn btn-outline-secondary rounded-3">
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ minHeight: '400px' }}>
                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1" style={{ height: '400px' }}>
                        <Loader2 size={45} className="text-primary spin mb-3" />
                        <span className="text-muted fw-medium">Actualisation des sessions...</span>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small text-muted">
                            <tr className="text-uppercase">
                                <th className="px-4 py-3 border-0 fw-normal">Appareil</th>
                                <th className="py-3 border-0 text-center">Début</th>
                                <th className="py-3 border-0 text-center">Fin</th>
                                <th className="py-3 border-0 text-end px-4">Durée</th>
                                <th className="py-3 border-0 text-end px-4">Prix</th>
                                <th className="py-3 border-0 text-end px-4">Volume</th>
                                <th className="py-3 border-0 text-end px-4"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">Aucune session active.</td>
                                </tr>
                            ) : (
                                sessions.map((session) => {
                                    const [h, m] = session.debutHeure.split(':').map(Number);
                                    const debut = new Date(); debut.setHours(h, m, 0);
                                    const mins = Math.floor((tempsActuel - debut) / 60000);

                                    return (
                                        <tr key={session.id}>
                                            <td className="px-4 py-3 fw-bold">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><Monitor size={18}/></div>
                                                    <div>
                                                        <div className="text-dark">{session.nomAppareil}</div>
                                                        <div className="small text-muted fw-normal">{session.systeme}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">{session.debutHeure}</td>
                                            <td className="py-3 text-center">
                                                    <span >
                                                        {session.finHeure}
                                                    </span>
                                            </td>
                                            <td className="py-3 text-center">
                                                {calculerDureeDynamique(session)}
                                            </td>
                                            <td className="py-3 text-center ">
                                                {(mins * 35).toLocaleString()} Ar
                                            </td>
                                            <td className="py-3 text-center">
                                                {(mins * 1.5).toFixed(1)} Mo
                                            </td>
                                            <td className="py-3 text-end px-4">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <button onClick={() => handleTerminate(session.id, session)} className="btn btn-outline-warning btn-sm rounded-3 border-0 bg-light-hover" title="Arrêter"><Power size={18}/></button>
                                                    <button onClick={() => handleDelete(session.id)} className="btn btn-outline-danger btn-sm rounded-3 border-0 bg-light-hover" title="Supprimer"><Trash2 size={18}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .bg-light-hover:hover { background-color: #f8f9fa !important; transition: 0.2s; }
            `}</style>
        </div>
    );
};

export default Utiliser;