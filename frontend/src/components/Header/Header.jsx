import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Navigation from './components/Navigation/Navigation';
import HeaderLink from './components/HeaderLink/HeaderLink';
import logo from '../../assets/images/logo.webp';
import './Header.css';
import {useAuth} from "../../context/AuthContext";

const Header = () => {
    const [isOpenNav, setIsOpenNav] = useState(false);
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <header>
                <img
                    src={logo}
                    alt="Logo"
                    className="logo"
                    onClick={() => setIsOpenNav(!isOpenNav)}
                />
                <Link to="/" className="header_title gradientText">L'Âge des Échos</Link>

                <div className="header_rightContent">
                    {isAuthenticated ? (
                        <>
                            <HeaderLink href="/characters">
                                <span>Continuer la Quête</span>
                            </HeaderLink>
                            <HeaderLink onClick={handleLogout}>
                                <span>Se déconnecter</span>
                            </HeaderLink>
                        </>
                    ) : (
                        <>
                            <HeaderLink href="/register">
                                <span>Rejoindre la Quête</span>
                            </HeaderLink>
                            <HeaderLink href="/login">
                                <span>Se connecter</span>
                            </HeaderLink>
                        </>
                    )}
                </div>
            </header>
            <Navigation isOpen={isOpenNav}/>
        </>
    );
};

export default Header;
