import React from 'react';
import { HelpCircle, Zap, ShieldAlert, Wifi, Info, MousePointer2, Calculator } from 'lucide-react';

const Help = () => {
    const guides = [
        {
            icon: <MousePointer2 size={20} className="text-primary" />,
            title: "Démarrer une session",
            desc: "Allez dans l'onglet 'Postes', choisissez un appareil détecté, définissez le mode (Temps limité ou Illimité) et cliquez sur Lancer."
        },
        {
            icon: <Calculator size={20} className="text-success" />,
            title: "Calcul du Tarif",
            desc: "Le tarif est configuré à 47 Ar par minute. Le calcul se fait automatiquement en temps réel dès que la session commence."
        },
        {
            icon: <Wifi size={20} className="text-info" />,
            title: "Consommation Data",
            desc: "Le système estime une consommation moyenne de 1.5 Mo par minute par poste pour vous aider à suivre l'état de votre forfait internet."
        },
        {
            icon: <ShieldAlert size={20} className="text-danger" />,
            title: "Terminer une session",
            desc: "Utilisez le bouton 'Power' rouge dans l'onglet 'Utiliser'. Cela enregistre définitivement la durée et le prix dans vos statistiques."
        }
    ];

    return (
        <div className="p-3 animate-fade-in">
            {/* Header d'aide */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary text-white">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-white bg-opacity-20 rounded-3">
                        <HelpCircle size={32} />
                    </div>
                    <div>
                        <h3 className="fw-bold m-0">Centre d'aide & Guide</h3>
                        <p className="m-0 opacity-75">Tout ce qu'il faut savoir pour maîtriser Wifi Manager.</p>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Guide Rapide */}
                <div className="col-12 col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <h5 className="fw-bold mb-4">Guide d'utilisation rapide</h5>
                        <div className="d-flex flex-column gap-4">
                            {guides.map((item, index) => (
                                <div key={index} className="d-flex gap-3 align-items-start p-3 rounded-3 border-start border-4 border-light hover-guide">
                                    <div className="p-2 bg-light rounded-2">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">{item.title}</h6>
                                        <p className="text-muted small mb-0">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ & Astuces */}
                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <Zap size={20} className="text-warning" /> Astuce Pro
                        </h5>
                        <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-3">
                            <p className="small text-dark mb-0">
                                <strong>Le saviez-vous ?</strong> Vous pouvez surveiller la consommation globale de tous vos postes en un coup d'œil via le badge "Données" en haut de la page de gestion.
                            </p>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-light">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <Info size={20} className="text-secondary" /> Rappel Important
                        </h5>
                        <p className="small text-muted">
                            Si vous fermez l'application sans "Terminer" les sessions, les calculs de durée s'arrêteront, mais les sessions resteront dans l'état "En cours". Pensez à toujours valider la fin d'une session pour vos recettes.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-guide {
                    transition: all 0.2s ease;
                    background: #fff;
                }
                .hover-guide:hover {
                    background: #f8f9fa;
                    border-start-color: #0d6efd !important;
                    transform: translateX(5px);
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Help;