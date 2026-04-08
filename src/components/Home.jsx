import React from 'react';
import { Users, Monitor, Clock, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="p-2">
            <div className="mb-4">
                <h2 className="fw-bold text-dark">Tableau de bord</h2>
                <p className="text-muted">Aperçu en temps réel de votre activité Wi-Fi.</p>
            </div>

            {/* GRILLE DE CARTES STATISTIQUES */}
            <div className="row g-4">
                <StatCard title="Postes Actifs" value="8 / 12" icon={<Monitor size={24}/>} color="primary" />
                <StatCard title="Clients Connectés" value="5" icon={<Users size={24}/>} color="info" />
                <StatCard title="Temps Moyen" value="45 min" icon={<Clock size={24}/>} color="warning" />
                <StatCard title="Performance" value="98%" icon={<Zap size={24}/>} color="success" />
            </div>

            {/* SECTION INFO SERVEUR */}
            <div className="mt-5 p-4 bg-light rounded-4 border">
                <h5 className="fw-bold mb-3 text-primary">Informations Système</h5>
                <div className="row">
                    <div className="col-md-6">
                        <p className="mb-1 text-muted small uppercase fw-bold">Adresse IP du Serveur</p>
                        <p className="fw-medium">192.168.1.100</p>
                    </div>
                    <div className="col-md-6">
                        <p className="mb-1 text-muted small uppercase fw-bold">Port de scan</p>
                        <p className="fw-medium text-success">5000 (Ouvert)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Petit composant interne pour les cartes
const StatCard = ({ title, value, icon, color }) => (
    <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <p className="text-muted small mb-1 fw-medium">{title}</p>
                    <h3 className="fw-bold mb-0">{value}</h3>
                </div>
                <div className={`bg-${color} bg-opacity-10 p-3 rounded-4 text-${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

export default Home;