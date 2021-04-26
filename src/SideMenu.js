import React from 'react';
import PropTypes from 'prop-types';
import {Menu} from "primereact/menu";

const SideMenu = props => {
    const items = [
        {label: 'Protocolli locali', icon: 'pi pi-fw pi-file'},
        {label: 'Protocolli AREU', icon: 'pi pi-fw pi-file'},
        {label: 'Linee SOREU', icon: 'pi pi-fw pi-info-circle'},
        {label: 'Utenze', icon: 'pi pi-fw pi-info-circle'},
    ]

    return (
        <>
            <Menu model={items}/>
        </>
    );
};

SideMenu.propTypes = {};

export default SideMenu;