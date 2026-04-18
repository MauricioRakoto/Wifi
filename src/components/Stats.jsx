import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Line, ComposedChart } from 'recharts';
import { Database, ChevronLeft, ChevronRight, BarChart3, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const Stats = () => {
    const [dateSelected, setDateSelected] = useState(new Date());
    const [statsSemaine, setStatsSemaine] = useState([]);
    const [loading, setLoading] = useState(true);

    const getLundi = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const maintenant = new Date();
            const debutSemaineActuelle = getLundi(maintenant);
            const finSemaineActuelle = new Date(debutSemaineActuelle);
            finSemaineActuelle.setDate(debutSemaineActuelle.getDate() + 6);
            finSemaineActuelle.setHours(23, 59, 59, 999);

            if (date >= debutSemaineActuelle && date <= finSemaineActuelle) {
                return 'semaine-actuelle';
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchStatsReelles = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/sessions');
                const allSessions = await response.json();

                const lundi = getLundi(dateSelected);
                const joursSemaine = [];

                for (let i = 0; i < 7; i++) {
                    const currentDay = new Date(lundi);
                    currentDay.setDate(lundi.getDate() + i);
                    const dateStr = currentDay.toLocaleDateString('fr-FR');

                    const sessionsDuJour = allSessions.filter(s => {
                        const sessionDate = new Date(s.createdAt || new Date()).toLocaleDateString('fr-FR');
                        return sessionDate === dateStr && s.status === 'Terminé';
                    });

                    const totalVolume = sessionsDuJour.reduce((acc, s) => acc + parseFloat(s.volumeTotal || 0), 0);
                    const totalRevenu = sessionsDuJour.reduce((acc, s) => acc + parseInt(s.prixTotal || 0), 0);

                    joursSemaine.push({
                        name: currentDay.toLocaleDateString('fr-FR', { weekday: 'short' }),
                        fullDate: currentDay.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                        volume: parseFloat(totalVolume.toFixed(3)),
                        revenu: totalRevenu,
                        count: sessionsDuJour.length
                    });
                }
                setStatsSemaine(joursSemaine);
            } catch (err) {
                console.error("Erreur stats:", err);
            } finally {
                // Délai identique au composant Postes pour la cohérence visuelle
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchStatsReelles();
    }, [dateSelected]);

    const volumeTotalSemaine = statsSemaine.reduce((acc, j) => acc + j.volume, 0).toFixed(2);

    return (
        <div className="p-2">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold m-0 text-dark">Consommation</h2>
                <div className="d-flex gap-2">
                    <div className="badge bg-white text-primary border border-primary border-opacity-10 rounded-pill px-3 py-2 shadow-sm d-flex align-items-center">
                        <Database size={14} className="me-2 text-info"/> {volumeTotalSemaine} Go consommés
                    </div>
                    <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-3 py-2">
                        Semaine du {getLundi(dateSelected).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Section Calendrier */}

                {/* Section Graphique & Table avec Loading */}
                <div className="">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative" style={{ minHeight: '500px' }}>
                        {loading ? (
                            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1" style={{ height: '500px' }}>
                                <Loader2 size={45} className="text-primary spin mb-3" />
                                <span className="text-muted fw-medium">Compilation des statistiques...</span>
                            </div>
                        ) : (
                            <div className="animate-fade-in">

                                <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 h-100">
                                    <div className="d-flex align-items-center gap-2 mb-3 text-muted small fw-bold">
                                        <CalendarIcon size={16} className="text-primary"/> FILTRER PAR DATE
                                    </div>
                                    <Calendar
                                        onChange={setDateSelected}
                                        value={dateSelected}
                                        tileClassName={getTileClassName}
                                        className="border-0 w-100"
                                        nextLabel={<ChevronRight size={18}/>}
                                        prevLabel={<ChevronLeft size={18}/>}
                                    />
                                </div>
                                {/* Graphique */}
                                <div className="p-4 bg-white border-bottom">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h6 className="fw-bold m-0 text-muted small text-uppercase">Flux de données &
                                            Revenus</h6>
                                        <div className="d-flex gap-3 small">
                                            <span className="fw-bold" style={{color: '#0dcaf0'}}>● Data</span>
                                            <span className="fw-bold" style={{color: '#0d6efd'}}>● Ar</span>
                                        </div>
                                    </div>
                                    <div style={{width: '100%', height: 250}}>
                                        <ResponsiveContainer>
                                            <ComposedChart data={statsSemaine}>
                                                <defs>
                                                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.1}/>
                                                        <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f9fa"/>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false}
                                                       tick={{fill: '#adb5bd', fontSize: 11}} dy={10}/>
                                                <YAxis hide/>
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                                                    }}
                                                    formatter={(value, name) => [name === 'volume' ? `${value} Go` : `${value.toLocaleString()} Ar`, name === 'volume' ? 'Volume' : 'Revenu']}
                                                />
                                                <Bar dataKey="volume" fill="#0dcaf0" radius={[4, 4, 0, 0]}
                                                     barSize={30}/>
                                                <Area type="monotone" dataKey="revenu" fill="url(#colorArea)"
                                                      stroke="none"/>
                                                <Line type="monotone" dataKey="revenu" stroke="#0d6efd" strokeWidth={3}
                                                      dot={{r: 4, fill: '#0d6efd', stroke: '#fff', strokeWidth: 2}}/>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Tableau récapitulatif */}
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light text-muted small">
                                        <tr>
                                            <th className="px-4 py-3 border-0 fw-normal">Jour</th>
                                            <th className="py-3 border-0 text-center fw-normal">Sessions</th>
                                            <th className="py-3 border-0 text-center fw-normal">Volume</th>
                                            <th className="py-3 border-0 text-end px-4 fw-normal">Recette</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {statsSemaine.map((j, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 fw-bold text-dark">{j.name} {j.fullDate}</td>
                                                <td className="py-3 text-center small text-muted">{j.count} postes</td>
                                                <td className="py-3 text-center">
                                                        <span
                                                            className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 fw-bold">
                                                            {j.volume} Go
                                                        </span>
                                                </td>
                                                <td className="py-3 text-end px-4 fw-bold text-success">
                                                    {j.revenu.toLocaleString()} Ar
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                .spin { animation: spin 1s linear infinite; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }

                .react-calendar { border-radius: 12px; font-family: inherit; border: none !important; width: 100% !important; }
                .semaine-actuelle { background-color: #f0f7ff !important; position: relative; }
                .semaine-actuelle::after {
                    content: ''; position: absolute; bottom: 5px; left: 25%; width: 50%; height: 3px; background: #0d6efd; border-radius: 10px;
                }
                .react-calendar__tile--active { background: #0d6efd !important; border-radius: 8px; color: white !important; }
                .react-calendar__tile--now { background: #ffc107 !important; color: #000 !important; font-weight: bold; border-radius: 8px; }
            `}</style>
        </div>
    );
};

export default Stats;