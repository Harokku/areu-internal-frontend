import React from 'react';
import PropTypes from 'prop-types';
import {Panel} from "primereact/panel";
import {Menu} from "primereact/menu";

const ShiftMenu = (props) => {

    const buildMenuItems = () => (
        props.items.map(item => (
            {
                label: `${item[0].toUpperCase()}${item.slice(1)}`,
                items: [
                    {label: 'Turni', command: () => requireFile(item, 'turni')},
                    {label: 'Postazioni', command: () => requireFile(item, 'postazioni')}
                ]
            }
        ))
    )

    // Show downloaded blob in a new browser tab
    const showInBrowser = (blob) => {
        const data = URL.createObjectURL(blob)
        window.open(data, '_blank')
    }

    // Request file from server based on type
    const requireFile = (itemName, itemType) => {
        let url = `${process.env.REACT_APP_BACKEND}/api/v1/shift/serveByPath/${itemName}/${itemType}`
        return fetch(url, {
            method: 'GET',
        })
            .then(r => r.blob())
            .then(showInBrowser)
    }

    return (
        <Panel className="p-d-flex" header="Turni">
            <div className="p-pb-2">
                <Menu model={buildMenuItems()}/>
            </div>
        </Panel>
    )
};

ShiftMenu.propTypes = {
    items: PropTypes.array.isRequired // Array of shift to display
}

export default ShiftMenu;