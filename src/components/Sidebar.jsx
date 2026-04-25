import {BarChart3, CodeXml, Info, LayoutDashboard, Monitor, PlayCircle, UserCircle} from "lucide-react";
import React from "react";
import wifiIcon from "../assets/img/min.png";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    const activeLink = ({ isActive }) =>
        `nav-link d-flex align-items-center gap-3 p-3 rounded-3 ${isActive ? 'nav-active' : ''}`;

    return (
        <aside className="navwifi text-white shadow" style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{background: '#7bbde8', color: '#000'}}
                 className="p-4 d-flex align-items-center gap-3 border-bottom border-light border-opacity-25">
                <div className="p-2 rounded-3 text-primary d-flex align-items-center">
                    <img style={{width: '30px', height: '30px'}} src={wifiIcon} alt=""/>
                </div>
                <h1 style={{fontSize: '25px', fontWeight: '500'}}>Wifi Manager</h1>
            </div>

            <nav className="nav flex-column p-3 gap-2">
                <NavLink to="/" className={activeLink}>
                    <LayoutDashboard size={20}/><span className="fw-medium">Accueil</span>
                </NavLink>
                <NavLink to="/postes" className={activeLink}><Monitor size={20}/>
                    <span className="fw-medium">Postes</span>
                </NavLink>
                <NavLink to="/utiliser" className={activeLink}>
                    <PlayCircle size={20}/>
                    <span className="fw-medium">Utiliser</span>
                </NavLink>
                <NavLink to="/stats" className={activeLink}><BarChart3 size={20}/>
                    <span className="fw-medium">Statistiques</span>
                </NavLink>
                <NavLink to="/about" className={activeLink}>
                    <CodeXml size={20}/><span className="fw-medium">Apropos</span>
                </NavLink>
                <NavLink to="/help" className={activeLink}>
                    <Info size={20}/><span className="fw-medium">Aides</span>
                </NavLink>
            </nav>

            <div className="mt-auto p-4 border-top border-light border-opacity-10 text-dark small">
                v1 - 2026 © WifiManager
            </div>
        </aside>
    );
};

export default Sidebar;