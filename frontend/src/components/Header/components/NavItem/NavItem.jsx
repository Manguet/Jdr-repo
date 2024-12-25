import React from 'react';
import './NavItem.css';
import {Link} from "react-router-dom";

const NavItem = ({ href, label, icon: Icon }) => {
    return (
        <li className="navItem">
            <Link to={href} className="navItem_link">
                <img src={Icon} alt={label} />
                <span>{label}</span>
            </Link>
        </li>
    );
};

export default NavItem;
