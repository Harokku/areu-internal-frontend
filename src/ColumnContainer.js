import React, {useEffect, useState} from 'react';
import "./ColumnContainer.css"
import DocsMenu from "./DocsMenu";
import ShiftMenu from "./ShiftMenu";
import TableData from "./TableData";
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {Menu} from "primereact/menu";
import axios from "axios";

const ColumnContainer = (props) => {
    //If side menu is visible or hidden
    const [showMenu, setShowMenu] = useState(false)
    //Components to display in the main view
    const [compToDisplay, setCompToDisplay] = useState([
            {id: 'documenti', comp: DocsMenu, props: null, visible: true},
            {id: 'turni', comp: ShiftMenu, props: {items: []}, visible: false},
        ]
    )
    //Menu items to display in side menu
    //useState set hardcoded value, subsequent useEffect will fetch index from backend and build menu hierarchy
    const [menuItems, setMenuItems] = useState([
            {
                label: "Documenti scaricabili",
                items: [
                    {
                        id: 'documenti',
                        label: 'Documenti',
                        icon: 'pi pi-fw pi-file',
                        command: (event) => componentToggle(event.item.id),
                    },
                ]
            },
            {
                label: "Info",
                items: []
            },
        ]
    )

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/content`
        )
        buildMenu(res.data.data)
    }

    //Build menu object based on backend index data and update state
    const buildMenu = (index) => {
        //Build content menu items and update state
        const menuItemList = index.map(item => (
            {
                id: item.link,
                label: item.display_name,
                icon: 'pi pi-fw pi-file',
                command: (event) => componentToggle(event.item.id)
            }
        ))
        setMenuItems(prev => prev.map(i => (
            i.label === "Info"
                ? {...i, items: menuItemList}
                : i
        )))

        //Build component items and add to component to display array
        const componentList = index.map(item => (
            {
                id: item.link,
                comp: TableData,
                props: {header: item.display_name, content: item.link},
                visible: false
            }
        ))
        setCompToDisplay(prev => [...prev, ...componentList])
    }

    //Toggle component visibility
    const componentToggle = (id) => {
        setCompToDisplay(prev => prev.map(i =>
            i.id === id
                ? {...i, visible: !i.visible}
                : i
        ))
    }

    // Toggle items based on menu selection
    const menuToggle = (id) => {
        let splitted = id.split('-')
        splitted.length > 1
            ? setCompToDisplay(propToggle(splitted))
            : setCompToDisplay(compToDisplay.map(i =>
                i.id === splitted[0]
                    ? {...i, visible: !i.visible}
                    : i
            ))
    }

    // Check is clicked menu item is present in props array and toggle it
    // Hide block if props is null
    const propToggle = (splittedId) => (
        compToDisplay.map(i => {
            if (i.id === splittedId[0]) {
                let index = i.props.items.indexOf(splittedId[1])
                if (index !== -1) {
                    i.props.items.splice(index, 1)
                    if (i.props.items.length === 0) i.visible = false
                } else {
                    i.props.items.push(splittedId[1])
                    i.visible = true
                }
            }
            return i
        })
    )

    return (
        <>
            <div className='p-d-flex'>
                <Button icon="pi pi-bars" onClick={() => setShowMenu(true)}/>
                <Sidebar visible={showMenu} onHide={() => setShowMenu(false)}>
                    <Menu model={menuItems}/>
                </Sidebar>
            </div>
            <div>
                <div className="p-grid p-m-2 p-flex-wrap">
                    {compToDisplay.map((item) => {
                        if (item.visible) {
                            return (
                                <div key={item.id} className="p-col">
                                    {React.createElement(item.comp, item.props, null)}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    )
};

export default ColumnContainer;