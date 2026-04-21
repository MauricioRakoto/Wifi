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
        <div className="">

            {/* --- SECTION DIVISIONS (Statistiques) --- */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card card-stats rounded-4 p-4">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="p-3 bg-opacity-10 rounded-4">
                                <Monitor size={28}/>
                            </div>

                            <div>
                                <h3 className="small fw-bold">Postes </h3>
                                <h2 className="fw-bold mb-0">{stats.totalPostes}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div
                        className="card card-stats rounded-4 p-4 ">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="p-3 bg-opacity-10 ">
                                <Activity size={28}/>
                            </div>

                            <div>
                                <h3 className="small fw-bold">Actifs</h3>
                                <h2 className="fw-bold mb-0 ">{stats.actifs}</h2>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="card card-stats  rounded-4 p-4  ">
                        <div className="d-flex justify-content-between align-items-center">

                            <div className="p-3 bg-opacity-10 rounded-4">
                                <Database size={28}/>
                            </div>

                            <div>
                                <h3 className="small fw-bold">Volumes</h3>
                                <h2 className="fw-bold mb-0">{stats.volumeTotal}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NAVIGATION / ONGLETS --- */}
            <div className="session-nav d-flex gap-3 mb-4 p-2 rounded-4 w-fit-content">
                <button
                    onClick={() => setView('active')}
                    className={`btn rounded-3 px-4 fw-bold d-flex  gap-2 ${view === 'active' ? 'btn-true ' : ''}`}
                >
                    <Play size={16}/> En cours
                </button>
                <button
                    onClick={() => setView('termine')}
                    className={`btn rounded-3 px-4 fw-bold d-flex  gap-2 ${view === 'termine' ? 'btn-false ' : ''}`}
                >
                    <CheckCircle size={16}/> Terminé
                </button>
            </div>

            {/* --- TABLEAU DES DONNÉES --- */}
            <div className="data-session">
                {/* En-tête des colonnes (Masqué sur mobile) */}
                <div className="row sh px-4 py-2 text-muted small fw-normal d-none d-md-flex  mb-2">
                    <div className="col-1">#</div>
                    <div className="col-4">Appareil</div>
                    <div className="col-2 text-center">Début</div>
                    <div className="col-2 text-center">Fin</div>
                    <div className="col-3 text-end px-4">Durée</div>
                </div>

                {/* Corps des données */}
                {filteredSessions.length === 0 ? (
                    <div className="text-center py-5 text-muted bg-light rounded-4">
                        Aucune session {view === 'active' ? 'en cours' : 'terminée'}.
                    </div>
                ) : (

                    <div className="row sb session px-4 py-2   fw-normal d-none d-md-flex  mb-2">
                        {filteredSessions.map((session, index) => (
                            <div key={session.id}
                                className="row " >
                                <div className="col-1">
                                    <h4>{index + 1}</h4>
                                </div>
                                <div className="col-4">
                                    <h4>{session.nomAppareil}</h4>
                                </div>
                                <div className="col-2 text-center">
                                    <h4>{session.debutHeure}</h4>
                                </div>
                                <div className="col-2 text-center">
                                    <h4>{session.finHeure}</h4>
                                </div>
                                <div className="col-3 text-end px-4">
                                    <h4>{calculerDuree(session.debutHeure, session.finHeure)}</h4>
                                </div>
                            </div>



                ))}
            </div>
            )}
        </div>

</div>
)
    ;
};

export default Home;