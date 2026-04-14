import React, { useState, useEffect } from 'react';
import { Monitor, Clock, Play, Square, Activity, Database, CheckCircle, List } from 'lucide-react';

const Home = () => {
    const [sessions, setSessions] = useState([]);
    const [view, setView] = useState('active'); // 'active' ou 'termine'
    const [stats, setStats] = useState({ actifs: 0, totalPostes: 0, volumeTotal: 0 });

    const fetchSessions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sessions');
            const data = await response.json();
            setSessions(data);

            // Calcul des statistiques globales
            const actifs = data.filter(s => s.status === 'En cours').length;
            const uniquePostes = [...new Set(data.map(s => s.nomAppareil))].length;

            setStats({
                actifs,
                totalPostes: uniquePostes,
                volumeTotal: data.length
            });
        } catch (err) {
            console.error("Erreur Home:", err);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000); // Rafraîchir les stats
        return () => clearInterval(interval);
    }, []);

    const filteredSessions = sessions.filter(s =>
        view === 'active' ? s.status === 'En cours' : s.status === 'Terminé'
    );

    const calculerDuree = (debut, fin) => {
        if (fin === "Illimitée") return "Illimitée";
        const [hD, mD] = debut.split(':').map(Number);
        const [hF, mF] = fin.split(':').map(Number);
        let diff = (hF * 60 + mF) - (hD * 60 + mD);
        if (diff < 0) diff += 1440;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return h > 0 ? `${h}h ${m}m` : `${m} min`;
    };

    return (
        <div className="p-4">

            {/* --- SECTION DIVISIONS (Statistiques) --- */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-primary">
                                <Monitor size={28}/>
                            </div>

                            <div>
                                <h6 className="text-muted text-uppercase small fw-bold">Postes </h6>
                                <h2 className="fw-bold mb-0 text-dark">{stats.totalPostes}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div
                        className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-success border-4">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="p-3 bg-success bg-opacity-10 rounded-4 text-success">
                                <Activity size={28}/>
                            </div>

                            <div>
                                <h6 className="text-muted text-uppercase small fw-bold">Actifs</h6>
                                <h2 className="fw-bold mb-0 text-success">{stats.actifs}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-info border-4">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="p-3 bg-info bg-opacity-10 rounded-4 text-info">
                                <Database size={28}/>
                            </div>

                            <div>
                                <h6 className="text-muted text-uppercase small fw-bold">Volumes</h6>
                                <h2 className="fw-bold mb-0 text-info">{stats.volumeTotal}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NAVIGATION / ONGLETS --- */}
            <div className="d-flex gap-3 mb-4 bg-light p-2 rounded-4 w-fit-content">
                <button
                    onClick={() => setView('active')}
                    className={`btn rounded-3 px-4 fw-bold d-flex align-items-center gap-2 ${view === 'active' ? 'btn-primary shadow' : 'btn-light text-muted'}`}
                >
                    <Play size={16} /> En cours
                </button>
                <button
                    onClick={() => setView('termine')}
                    className={`btn rounded-3 px-4 fw-bold d-flex align-items-center gap-2 ${view === 'termine' ? 'btn-success shadow' : 'btn-light text-muted'}`}
                >
                    <CheckCircle size={16} /> Terminé
                </button>
            </div>

            {/* --- TABLEAU DES DONNÉES --- */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted small">
                        <tr>
                            <th className="px-4 py-3 border-0">Appareil</th>
                            <th className="py-3 border-0">Début</th>
                            <th className="py-3 border-0">Fin</th>
                            <th className="py-3 border-0 text-center">Durée</th>

                        </tr>
                        </thead>
                        <tbody>
                        {filteredSessions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">
                                    Aucune session {view === 'active' ? 'en cours' : 'terminée'}.
                                </td>
                            </tr>
                        ) : (
                            filteredSessions.map((session) => (
                                <tr key={session.id}>
                                    <td className="px-4 py-3 fw-bold">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`p-1 rounded-circle ${view === 'active' ? 'bg-success' : 'bg-secondary'}`} style={{width: '8px', height: '8px'}}></div>
                                            {session.nomAppareil}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div
                                            className="small text-muted">{session.debutHeure}</div>
                                    </td>
                                    <td className="py-3">
                                        <div className="small text-muted">{session.finHeure}</div>
                                    </td>
                                    <td className="py-3 text-center">
                                        <div className="small text-muted">{calculerDuree(session.debutHeure, session.finHeure)}</div>

                                    </td>

                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;