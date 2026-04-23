import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// Ajout de LabelList dans les imports Recharts
import {
    Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Area, Line, ComposedChart,
    LabelList
} from 'recharts';
import { Database, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

// Import de votre icône de chargement
import loadIcone from "../assets/img/load.png";

const Stats = () => {
    const [dateSelected, setDateSelected] = useState(new Date());
    const [statsSemaine, setStatsSemaine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tempsActuel, setTempsActuel] = useState(new Date());

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
                setTimeout(() => setLoading(false), 500);
            }
        };

        fetchStatsReelles();
    }, [dateSelected]);

    const volumeTotalSemaine = statsSemaine.reduce((acc, j) => acc + j.volume, 0).toFixed(2);

    return (
        <div className="p-2 cons-data mb-5 animate-fade-in">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">

                <h3 className="fw-bold m-0 text-dark">Consommation des données</h3>

                <div className="d-flex gap-2 data-opt">

                    <div className="badge ">

                        <Database size={16} className=""/> {volumeTotalSemaine} Go consommés

                    </div>

                    <div className="badge">

                        <CalendarIcon size={16} className=""/>Semaine du {getLundi(dateSelected).toLocaleDateString()}

                    </div>

                </div>

            </div>

            {loading ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5"
                     style={{minHeight: '400px'}}>
                    <img src={loadIcone} alt="loading" className="load-icone spin mb-3"/>
                    <span className="text-muted fw-medium">Analyse des données...</span>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        {/* Calendrier */}
                        <div className="col-12 col-md-5">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100 overflow-hidden">
                                <div className="text-muted small fw-bold mb-3 px-2">Choisir une date</div>
                                <Calendar
                                    onChange={setDateSelected}
                                    value={dateSelected}
                                    tileClassName={getTileClassName}
                                    className="custom-calendar"
                                    nextLabel={<ChevronRight size={18}/>}
                                    prevLabel={<ChevronLeft size={18}/>}
                                    formatShortWeekday={(locale, date) =>
                                        date.toLocaleDateString(locale, {weekday: 'short'}).replace('.', '')
                                    }
                                />
                            </div>
                        </div>

                        {/* Graphique */}
                        <div className="col-12 col-md-7">
                            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h6 className="fw-bold m-0 text-muted small ">Flux de données & Revenus</h6>
                                    <div className="d-flex gap-3 small">
                                        <span className="fw-bold">● Mo</span>
                                        <span className="fw-bold">● Ar</span>
                                    </div>
                                </div>

                                <div style={{width: '100%', height: 300}}>
                                    <ResponsiveContainer>
                                        <ComposedChart
                                            /* On convertit les Go en Mo pour le graphique */
                                            data={statsSemaine.map(d => ({...d, volumeMo: d.volume * 1000}))}
                                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                        >
                                            <defs>
                                                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>

                                            {/* On retire les lignes verticales pour le style épuré de l'image */}
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1"/>

                                            {/* AXE X : Style noir épais */}
                                            <XAxis
                                                dataKey="name"
                                                axisLine={{stroke: '#bfd7ed', strokeWidth: 3}} // Ligne noire épaisse
                                                tickLine={{stroke: '#bfd7ed', strokeWidth: 3}} // Graduations noires
                                                tick={{fill: '#000', fontSize: 13, fontWeight: '700'}}
                                                dy={10}
                                                // Force l'affichage des jours sans majuscule automatique
                                            />

                                            {/* AXE Y : Graduations Mo selon votre modèle */}
                                            <YAxis
                                                axisLine={{stroke: '#bfd7ed', strokeWidth: 3}}
                                                tickLine={{stroke: '#bfd7ed', strokeWidth: 3}}
                                                tick={{fill: '#000', fontSize: 13, fontWeight: '700'}}
                                                domain={[0, 3000]} // Échelle max 3000
                                                ticks={[500, 1000, 2000, 3000]} // Paliers spécifiques
                                                tickFormatter={(value) => `${value} Mo`}
                                                width={80}
                                            />

                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                                }}
                                                formatter={(value, name) => [
                                                    name === 'volumeMo' ? `${value} Mo` : `${value.toLocaleString()} Ar`,
                                                    name === 'volumeMo' ? 'Volume' : 'Revenu'
                                                ]}
                                            />


                                            {/* Ligne de revenu (optionnelle si vous ne voulez que le volume) */}
                                            <Area type="monotone" dataKey="revenu" fill="url(#colorArea)"
                                                  stroke="none"/>
                                            <Line
                                                type="monotone"
                                                dataKey="revenu"
                                                stroke="#4b1c71"
                                                strokeWidth={4} // Ligne un peu plus épaisse
                                                dot={{r: 5, fill: '#001b48', stroke: '#fff', strokeWidth: 2}}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau récapitulatif */}
                    <div className="row">
                        <div className="col-12">
                            <div className="table-container-rounded shadow-sm">
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
                                                <td className="px-4 py-3">{j.name} {j.fullDate}</td>

                                                <td className="text-center">{j.count} postes</td>

                                                <td className="text-center">{j.volume} Go</td>

                                                <td className="py-3 text-end px-4 fw-bold">{j.revenu.toLocaleString()} Ar</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                .spin { animation: spin 1s linear infinite; }
                .load-icone { width: 40px; height: 40px; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }

                /* Style Calendrier Custom */
                .custom-calendar.react-calendar { width: 100% !important; border: none !important; font-family: inherit; }
                .react-calendar__month-view__weekdays__weekday { text-transform: lowercase !important; font-weight: 600; color: #adb5bd; }
                .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none !important; }
                
                .semaine-actuelle { background-color: #f0f7ff !important; position: relative; }
                .semaine-actuelle::after {
                    content: ''; position: absolute; bottom: 5px; left: 25%; width: 50%; height: 3px; background: #0d6efd; border-radius: 10px;
                }
                .react-calendar__tile--active { background: #0d6efd !important; border-radius: 8px; color: white !important; }
                .react-calendar__tile--now { background: #ffc107 !important; color: #000 !important; font-weight: bold; border-radius: 8px; }
                
                .table-container-rounded { border-radius: 1rem; overflow: hidden; background: white; border: 1px solid #f1f1f1; }
            `}</style>
        </div>
    );
};

export default Stats;