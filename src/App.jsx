import React, { useState, useEffect } from 'react';
import {
    UserCircle,
    LayoutDashboard,
    Monitor,
    PlayCircle,
    BarChart3,
    Wifi,
    Loader2,
    Info,
    Target,
    CodeXml
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Postes from "./components/Postes.jsx";
import Utiliser from "./components/Utiliser.jsx";
import Stats from "./components/Stats.jsx";
import About from "./components/About.jsx";
import Help from "./components/Help.jsx";
import EditConfig from "./components/EditConfig.jsx";

import ActivationToken from './components/ActivationToken';
import Config from "./components/Config.jsx";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";

import wifiIcon from '../src/assets/img/min.png';

function App() {
    // État pour forcer la mise à jour des composants quand la config change
    const [configTick, setConfigTick] = useState(0);

    const rafraichirConfig = () => setConfigTick(prev => prev + 1);

    const [isActivated, setIsActivated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Simulation du chargement initial (comme WhatsApp)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 secondes de splash screen
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('wifi_token');
        const expiry = localStorage.getItem('wifi_expiry');

        if (token && expiry) {
            const now = new Date();
            if (now < new Date(expiry)) {
                setIsActivated(true);
            } else {
                localStorage.removeItem('wifi_token'); // Expiré
                localStorage.removeItem('wifi_expiry');
            }
        }
    }, []);

    if (!isActivated) {
        return <ActivationToken onActivate={setIsActivated} />;
    }



    // --- ÉCRAN DE CHARGEMENT (STYLE WHATSAPP) ---
    if (isLoading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh'}}>
                <div className="position-relative d-flex align-items-center justify-content-center mb-4">
                    <div className="bg-transparent">
                        <img src={wifiIcon} alt=""/>
                    </div>
                </div>
                <h2 className="fw-bold text-dark mb-2">WifiManager</h2>
                <div className="mt-5 text-dark small opacity-50">
                    v1 - 2026 © WifiManger
                </div>
            </div>
        );
    }

    // --- CONTENU PRINCIPAL ---
    return (
        <Router>
            <div className="container-fluid p-0">
                <div className="d-flex" style={{ minHeight: '100vh' }}>
                    {/* Sidebar */}
                    <Sidebar key={`side-${configTick}`} />

                    {/* Main Content */}
                    <main className="flex-grow-1 d-flex flex-column">
                        <Header key={`head-${configTick}`} />

                        <div className="container-fluid p-4">
                            <div className="wifi rounded-4 shadow-sm p-2 animate-fade-in" style={{minHeight: '85vh'}}>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/postes" element={<Postes/>}/>
                                    <Route path="/utiliser" element={<Utiliser/>}/>
                                    <Route path="/stats" element={<Stats/>}/>
                                    <Route path="/about" element={<About/>}/>
                                    <Route path="/help" element={<Help/>}/>
                                    <Route path="/econfig" element={<EditConfig/>}/>
                                </Routes>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style>
                {`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    
                    .spin { animation: spin 1s linear infinite; }
                    .animate-bounce { animation: bounce 2s ease-in-out infinite; }
                    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                    
                    .hover-effect:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                        transition: 0.3s;
                    }
                    .nav-link { transition: 0.3s; }
                `}
            </style>
        </Router>
    );
}

export default App;