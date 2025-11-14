import React from 'react';
import {NavLink} from "react-router-dom";

const NavButton = ({toPage,pageName}) => {
    return (
        <div>
            <NavLink to={toPage}>{pageName}</NavLink>
        </div>
    );
};

export default NavButton;