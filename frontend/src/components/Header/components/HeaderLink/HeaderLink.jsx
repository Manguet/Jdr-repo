import React from 'react';
import { Link } from "react-router-dom";
import './HeaderLink.css';

const HeaderLink = ({ href, onClick, children }) => {
    if (onClick) {
        return (
            <button
                className="headerLink reverseStyle"
                onClick={onClick}
                type="button"
            >
                {children}
            </button>
        );
    }

    return (
        <Link to={href} className="headerLink reverseStyle">
            {children}
        </Link>
    );
};

export default HeaderLink;
