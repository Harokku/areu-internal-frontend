import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Menu} from "primereact/menu";
import {Button} from "primereact/button";

const SideMenu = props => {
    const menu = useRef(null)
    const items = [
        {
            label: "Documenti scaricabili",
            items: [
                {
                    id: 'documenti',
                    label: 'Documenti',
                    icon: 'pi pi-fw pi-file',
                    command: (event) => props.menuToggleCallback(event.item.id)
                },
                {label: 'Moduli', icon: 'pi pi-fw pi-file'}
            ]
        },
        {
            label: "Turni",
            items: [
                {
                    id: 'turni-tecnici',
                    label: 'Tecnici',
                    icon: 'pi pi-fw pi-calendar',
                    command: (event) => props.menuToggleCallback(event.item.id)
                },
                {
                    id: 'turni-infermieri',
                    label: 'Infermieri',
                    icon: 'pi pi-fw pi-calendar',
                    command: (event) => props.menuToggleCallback(event.item.id)
                },
                {
                    id: 'turni-medici',
                    label: 'Medici',
                    icon: 'pi pi-fw pi-calendar',
                    command: (event) => props.menuToggleCallback(event.item.id)
                },
            ]
        },
        {
            label: "Link",
            items: []
        },
        {label: 'Linee SOREU', icon: 'pi pi-fw pi-info-circle'},
        {label: 'Utenze', icon: 'pi pi-fw pi-info-circle'},
    ]

    return (
        <>
            <Menu className='p-d-none p-d-sm-block' model={items}/>
            <Menu model={items} popup ref={menu}/>
            <Button className='p-d-sm-none' label='Menu' icon='pi pi-bars' onClick={(e) => menu.current.toggle(e)}/>
        </>
    );
};

SideMenu.propTypes = {
    menuToggleCallback: PropTypes.func.isRequired
};

export default SideMenu;