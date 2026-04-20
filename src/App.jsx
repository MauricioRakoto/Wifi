import React, { useState, useEffect } from 'react';
import { UserCircle, LayoutDashboard, Monitor, PlayCircle, BarChart3, Wifi, Loader2 } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Postes from "./components/Postes.jsx";
import Utiliser from "./components/Utiliser.jsx";
import Stats from "./components/Stats.jsx";

import wifiIcon from '../src/assets/img/wifi.png';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulation du chargement initial (comme WhatsApp)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 secondes de splash screen
        return () => clearTimeout(timer);
    }, []);

    const activeLink = ({ isActive }) =>
        `nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 ${isActive ? 'bg-white bg-opacity-25 shadow-sm' : 'hover-effect'}`;

    // --- ÉCRAN DE CHARGEMENT (STYLE WHATSAPP) ---
    if (isLoading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
                <div className="position-relative d-flex align-items-center justify-content-center mb-4">
                    <div className="p-4 rounded-5 shadow-lg animate-bounce">
                        <img src={wifiIcon} alt=""/>
                    </div>
                </div>
                <h2 className="fw-bold text-dark mb-2">Wifi<span className="text-primary">Manager</span></h2>
                <div className="d-flex align-items-center gap-2 text-muted">
                    <Loader2 size={18} className="spin" />
                    <span className="small tracking-widest text-uppercase">Chargement...</span>
                </div>
                <div className="mt-5 text-muted small opacity-50">
                    v1.0.2 - 2026 © CyberNet
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
                    <aside className="navwifi text-white shadow" style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="p-4 d-flex align-items-center gap-3 border-bottom border-light border-opacity-25">
                            <div className="bg-white p-2 rounded-3 text-primary d-flex align-items-center">
                                <img style={{width: '30px', height: '30px'}} src={wifiIcon} alt=""/>
                            </div>
                            <h1 style={{fontSize: '25px', fontWeight: '500'}} >Wifi Manager</h1>
                        </div>

                        <nav className="nav flex-column p-3 gap-2">
                            <NavLink to="/" className={activeLink}><LayoutDashboard size={20}/><span className="fw-medium">Accueil</span></NavLink>
                            <NavLink to="/postes" className={activeLink}><Monitor size={20}/><span className="fw-medium">Postes</span></NavLink>
                            <NavLink to="/utiliser" className={activeLink}><PlayCircle size={20}/><span className="fw-medium">Utiliser</span></NavLink>
                            <NavLink to="/stats" className={activeLink}><BarChart3 size={20}/><span className="fw-medium">Statistiques</span></NavLink>
                        </nav>

                        <div className="mt-auto p-4 border-top border-light border-opacity-10 text-center text-white-50 small">
                            v1.0.2 - 2026 © CyberNet
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow-1 d-flex flex-column">
                        <header className="p-3 d-flex justify-content-end align-items-center border-bottom shadow-sm">
                            <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill">
                                <UserCircle size={24} className="text-primary"/>
                                <h4 className="m-0 fw-bold text-dark" style={{fontSize: '0.95rem'}}>Administrateur</h4>
                            </div>
                        </header>

                        <div className="container-fluid p-4">
                            <div className="wifi rounded-4 shadow-sm p-2 animate-fade-in" style={{minHeight: '85vh'}}>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/postes" element={<Postes/>}/>
                                    <Route path="/utiliser" element={<Utiliser/>}/>
                                    <Route path="/stats" element={<Stats/>}/>
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