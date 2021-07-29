import React from 'react';
import PropTypes from 'prop-types';
import {Menu} from "primereact/menu";

const SideMenu = props => {
    const menut =()=>{
        console.log("from inside")
    }

    return (
        <>

        </>
    );
};

SideMenu.propTypes = {
    menuToggleCallback: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired
};

export default SideMenu;
