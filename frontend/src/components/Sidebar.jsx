import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FilePlus,
    FileText,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Train,
    Menu,
    X,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, toggleRole } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/', roles: ['SSE'] },
        { icon: <FilePlus size={20} />, label: 'Create Report', path: '/create-report', roles: ['JE', 'SSE'] },
        { icon: <FileText size={20} />, label: 'Past Reports', path: '/reports', roles: ['SSE'] },
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics', roles: ['SSE'] },
        { icon: <Users size={20} />, label: 'Team', path: '/team', roles: ['SSE'] },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Filter menu items based on user role
    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            <button className="mobile-toggle" onClick={toggleSidebar}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}

            <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <Train className="logo-icon" />
                        <span className="logo-text">RWPM</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn" onClick={logout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <div className="user-profile">
                        <div className="avatar">{user?.role === 'JE' ? 'JE' : 'AD'}</div>
                        <div className="user-info">
                            <p className="user-name">{user.name}</p>
                            <p className="user-role">{user.designation}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
