import React, {useEffect, useState} from 'react';
import "./ColumnContainer.css"
import DocsMenu from "./DocsMenu";
import TableData from "./TableData";
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {Menu} from "primereact/menu";
import axios from "axios";
import DocsRecent from "./DocsRecent";
import CheckMainContainer from "./CheckMainContainer";

const ColumnContainer = (props) => {
    //If side menu is visible or hidden
    const [showMenu, setShowMenu] = useState(false)
    //Components to display in the main view
    const [compToDisplay, setCompToDisplay] = useState([
            {id: 'documenti', comp: DocsMenu, props: {key: 'documenti'}, visible: true},
            {id: 'checkconv', comp: CheckMainContainer, props: {key: 'checkconv'}, visible: false},
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
                        style: {},
                        command: (event) => componentToggle(event.item.id),
                    },
                ]
            },
            {
                label: "Info",
                items: []
            },
            {
                label: "Check",
                items: [
                    {
                        id: 'checkconv',
                        label: 'Convenzioni',
                        icon: 'pi pi-fw pi-list',
                        command: (event) => componentToggle(event.item.id),
                    }
                ]
            },
        ]
    )

    // Fetch data effect
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/content`
        )
        buildMenu(res.data.data)
    }

    // Menu item active effect
    // Check displayed component and set menu item background
    // Traverse hierarchy and set item style based on associated component display state
    useEffect(() => {
        setMenuItems(prev => prev.map(m => (
            {
                ...m, items: m.items.map(i => {
                    const componentStatus = compToDisplay.find(item => item.id === i.id)
                    return {
                        ...i, style: {background: componentStatus.visible ? 'darkcyan' : "unset"}
                    }
                })
            }
        )))
    }, [compToDisplay])

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
                props: {key: item.link, header: item.display_name, content: item.link},
                visible: false
            }
        ))
        setCompToDisplay(prev => [...prev, ...componentList])
    }

    //Toggle component visibility
    const componentToggle = (id) => {
        // Set component visible property do display it
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
            <div className='menucontainer'>
                <Button icon="pi pi-bars" onClick={() => setShowMenu(true)}/>
            </div>
            <Sidebar visible={showMenu} onHide={() => setShowMenu(false)}>
                <Menu model={menuItems}/>
            </Sidebar>
            <div className="p-d-flex p-flex-wrap p-jc-around">
                <DocsRecent/>
                {compToDisplay.map((item) => {
                    if (item.visible) {
                        return (
                            React.createElement(item.comp, item.props, null)
                        )
                    }
                })}
            </div>
        </>
    )
};

export default ColumnContainer;