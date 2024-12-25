import React from 'react';
import NavItem from '../NavItem/NavItem';
import { NAVIGATION_ITEMS } from '../../constants';
import './Navigation.css';

const Navigation = ({ isOpen }) => {
    return (
        <nav className={`header_nav ${isOpen ? 'open' : ''}`}>
            <ul>
                {NAVIGATION_ITEMS.map((item, index) => (
                    <NavItem key={index} {...item} />
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
