import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar />
            <main className="content-area">
                <div className="page-body">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
