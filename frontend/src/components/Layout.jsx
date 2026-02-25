import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-['Outfit']">
            <Sidebar />
            <main className="flex-1 ml-64 h-full overflow-y-auto dashboard-gradient custom-scrollbar">
                <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-full flex flex-col">
                    <div className="flex-grow">
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default Layout;
