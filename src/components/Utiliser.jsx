import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Clock, Calendar, Power, RotateCcw, Trash2 } from 'lucide-react';

const Utiliser = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempsActuel, setTempsActuel] = useState(new Date());

    // --- MISE À JOUR DU COMPTEUR (Toutes les secondes) ---
    useEffect(() => {
        const timer = setInterval(() => {
            setTempsActuel(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- RÉCUPÉRATION DES SESSIONS ---
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/sessions');
            const data = await response.json();
            // On ne garde que les sessions dont le statut est "En cours"
            setSessions(data.filter(s => s.status === 'En cours'));
        } catch (err) {
            console.error("Erreur de chargement des sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSessions(); }, []);

    // --- ACTION : ARRÊTER LE COMPTEUR ---
    const handleTerminate = async (id) => {
        if (window.confirm("Arrêter le compteur pour ce poste ?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/sessions/terminer/${id}`, {
                    method: 'PUT',
                });
                if (response.ok) {
                    setSessions(sessions.filter(s => s.id !== id));
                }
            } catch (err) {
                console.error("Erreur lors de l'arrêt");
            }
        }
    };

    // --- ACTION : SUPPRIMER LA SESSION ---
    const handleDelete = async (id) => {
        if (window.confirm("Supprimer définitivement cette session ?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setSessions(sessions.filter(s => s.id !== id));
                }
            } catch (err) {
                console.error("Erreur lors de la suppression");
            }
        }
    };

    // --- CALCUL DU TEMPS RÉEL ---
    const calculerDureeDynamique = (session) => {
        const [hDebut, mDebut] = session.debutHeure.split(':').map(Number);
        const debut = new Date();
        debut.setHours(hDebut, mDebut, 0);

        if (session.finHeure === "Illimitée") {
            let diffMs = tempsActuel - debut;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            const totalSec = Math.floor(diffMs / 1000);
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;
            return `${h}h ${m}m ${s}s`;
        } else {
            const [hFin, mFin] = session.finHeure.split(':').map(Number);
            const fin = new Date();
            fin.setHours(hFin, mFin, 0);
            let diffMs = fin - tempsActuel;
            if (diffMs <= 0) return "Terminé";
            const h = Math.floor(diffMs / (1000 * 60 * 60));
            const m = Math.floor((diffMs / (1000 * 60)) % 60);
            const s = Math.floor((diffMs / 1000) % 60);
            return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
        }
    };

    return (
        <div className="p-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0 text-dark">Sessions Actives</h2>
                <div className="d-flex gap-2">
                    <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 d-flex align-items-center px-3 rounded-3">
                        {sessions.length} Poste(s) en ligne
                    </div>
                    <button onClick={fetchSessions} className="btn btn-outline-secondary rounded-3">
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted small text-uppercase">
                        <tr>
                            <th className="px-4 py-3 border-0">Appareil</th>
                            <th className="py-3 border-0 text-center">Heures</th>
                            <th className="py-3 border-0">Temps Réel</th>
                            <th className="py-3 border-0 text-end px-4">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">Aucune session active.</td>
                            </tr>
                        ) : (
                            sessions.map((session) => (
                                <tr key={session.id}>
                                    <td className="px-4 py-3 fw-bold">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                <Monitor size={18} />
                                            </div>
                                            <div>
                                                <div className="text-dark">{session.nomAppareil}</div>
                                                <div className="small text-muted fw-normal">{session.systeme}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center">
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span className="badge bg-light text-dark border">{session.debutHeure}</span>
                                            <span className="text-muted small">à</span>
                                            <span className={`badge ${session.finHeure === "Illimitée" ? 'bg-info' : 'bg-danger'} bg-opacity-10 ${session.finHeure === "Illimitée" ? 'text-info' : 'text-danger'} border`}>
                                                    {session.finHeure}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="fw-bold d-flex align-items-center gap-2" style={{ fontFamily: 'monospace', fontSize: '1.05rem' }}>
                                            <Clock size={14} className={session.finHeure === "Illimitée" ? "text-success" : "text-primary"} />
                                            {calculerDureeDynamique(session)}
                                        </div>
                                    </td>
                                    <td className="py-3 text-end px-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-outline-primary btn-sm rounded-3 border-0 bg-light-hover" title="Reprendre"><RotateCcw size={16} /></button>
                                            <button onClick={() => handleTerminate(session.id)} className="btn btn-outline-warning btn-sm rounded-3 border-0 bg-light-hover" title="Arrêter"><Power size={16} /></button>
                                            <button onClick={() => handleDelete(session.id)} className="btn btn-outline-danger btn-sm rounded-3 border-0 bg-light-hover" title="Supprimer"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .bg-light-hover:hover { background-color: #f8f9fa !important; }
            `}</style>
        </div>
    );
};

export default Utiliser;