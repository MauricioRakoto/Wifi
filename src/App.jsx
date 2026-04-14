import React from 'react';
import { UserCircle } from 'lucide-react';
// On utilise NavLink à la place de Link
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Monitor, PlayCircle, BarChart3, Wifi } from 'lucide-react';
import Home from './components/Home';
import Postes from "./components/Postes.jsx";
import Utiliser from "./components/Utiliser.jsx";

function App() {
    // Fonction pour gérer le style actif dynamiquement avec Bootstrap
    const activeLink = ({ isActive }) =>
        `nav-link text-white d-flex align-items-center gap-3 p-3 rounded-3 ${isActive ? 'bg-white bg-opacity-25 shadow-sm' : 'hover-effect'}`;

    return (
        <Router>
            <div className="container-fluid p-0">
                <div className="d-flex" style={{ minHeight: '100vh' }}>
                    <aside className="bg-primary text-white shadow" style={{width: '280px', display: 'flex', flexDirection: 'column'}}>
                        <div className="p-4 d-flex align-items-center gap-3 border-bottom border-light border-opacity-25">
                            <div className="bg-white p-2 rounded-3 text-primary d-flex align-items-center">
                                <Wifi size={24}/>
                            </div>
                            <h1 className="h4 m-0 fw-bold tracking-tight">Wifi<span className="fw-light">Manager</span></h1>
                        </div>

                        <nav className="nav flex-column p-3 gap-2">
                            {/* Utilisation de NavLink avec la fonction activeLink */}
                            <NavLink to="/" className={activeLink}>
                                <LayoutDashboard size={20}/>
                                <span className="fw-medium">Accueil</span>
                            </NavLink>

                            <NavLink to="/postes" className={activeLink}>
                                <Monitor size={20}/>
                                <span className="fw-medium">Postes</span>
                            </NavLink>

                            <NavLink to="/utiliser" className={activeLink}>
                                <PlayCircle size={20}/>
                                <span className="fw-medium">Utiliser</span>
                            </NavLink>

                            <NavLink to="/stats" className={activeLink}>
                                <BarChart3 size={20}/>
                                <span className="fw-medium">Statistiques</span>
                            </NavLink>
                        </nav>

                        <div className="mt-auto p-4 border-top border-light border-opacity-10 text-center text-white-50 small">
                            v1.0.2 - 2026 © CyberNet
                        </div>
                    </aside>

                    <main className="flex-grow-1 bg-light d-flex flex-column">
                        <header
                            className="bg-white  p-3 d-flex justify-content-end align-items-center ">
                            <div className="d-flex align-items-center gap-2 bg-light px-3 py-1  ">
                                {/* Icône stylisée */}
                                <UserCircle size={24} className="text-primary"/>

                                {/* h4 avec typographie affinée */}
                                <h4 className="m-0 fw-bold text-dark"
                                    style={{fontSize: '0.95rem', letterSpacing: '0.5px'}}>
                                    Administrateur
                                </h4>
                            </div>
                        </header>

                        <div className="container-fluid p-4">
                            <div className="bg-white rounded-4 shadow-sm p-4" style={{minHeight: '85vh'}}>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/postes" element={<Postes/>}/>
                                    <Route path="/utiliser" element={<Utiliser/>}/>
                                    <Route path="/stats"
                                           element={<div className="p-4">📊 Interface Stats en cours...</div>}/>
                                </Routes>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style>
                {`
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