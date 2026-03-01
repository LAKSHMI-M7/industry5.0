import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
    const [clubInfo, setClubInfo] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { data } = await axios.get('/api/club-info');
                setClubInfo(data);
            } catch (err) {
                console.error('Error fetching footer info:', err);
            }
        };
        fetchInfo();
    }, []);

    const email = clubInfo?.email || 'industry5club@gmail.com';
    const instagram = clubInfo?.instagram || 'jit_industry5.0_club';
    const linkedin = clubInfo?.linkedin || 'https://www.linkedin.com/in/industry-5-0-club-9b34263a8';

    return (
        <footer className="site-footer">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px]">
                Industry 5.0 Club – Jeppiaar Institute of Technology
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <a href={`mailto:${email}`} className="hover:text-[#92400E] transition-colors">Email: {email}</a>
                <span className="hidden md:inline text-slate-200">|</span>
                <span className="hover:text-[#92400E] transition-colors">Instagram: {instagram}</span>
                <span className="hidden md:inline text-slate-200">|</span>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#92400E] transition-colors text-center max-w-[300px] truncate">
                    LinkedIn: {linkedin}
                </a>
            </div>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[4px] pt-2">
                © Jeppiaar Institute of Technology
            </p>
        </footer>
    );
};

export default Footer;
