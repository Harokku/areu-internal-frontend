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
import NewIssue from "./NewIssue"
import DocsFrequent from "./DocsFrequent";
import EpcrIssue from "./EpcrIssue";

const ColumnContainer = (props) => {
    //If side menu is visible or hidden
    const [showMenu, setShowMenu] = useState(false)
    //Components to display in the main view
    const [compToDisplay, setCompToDisplay] = useState([
            {id: 'documenti', comp: DocsMenu, props: {key: 'documenti'}, visible: true},
            {id: 'frequentbyip', comp: DocsFrequent, props: {key: 'frequentbyip', mode: "byip"}, visible: false},
            {id: 'frequentbyfunc', comp: DocsFrequent, props: {key: 'frequentbyfunc', mode: "byfunction"}, visible: false},
            {id: 'checkconv', comp: CheckMainContainer, props: {key: 'checkconv'}, visible: false},
            {id: 'issueList', visible: false},
            {id: 'issueNew', comp: NewIssue, visible: false},
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
                    {
                        id: 'frequentbyip',
                        label: 'Frequenti per postazione',
                        icon: 'pi pi-fw pi-clock',
                        command: (event) => componentToggle(event.item.id),
                    },
                    {
                        id: 'frequentbyfunc',
                        label: 'Frequenti per funzione',
                        icon: 'pi pi-fw pi-clock',
                        command: (event) => componentToggle(event.item.id),
                    }
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
            {
                label: "Consegne",
                items: [
                    {
                        id: 'issueList',
                        label: 'Consegne (Beta - WIP)',
                        icon: 'pi pi-fw pi-list',
                        command: () => openLinkInNewTab(),
                    },
                    {
                        id: 'issueNew',
                        label: 'Nuova consegna (Beta - WIP)',
                        icon: 'pi pi-fw pi-list',
                        command: (event) => componentToggle(event.item.id),
                    }
                ]
            }
        ]
    )

    // Fetch data effect
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        // Info menu data fetch
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/content`
        )
        buildMenu(res.data.data)

        // Check if client ip is in te auth list and build epcr issue menu
        try {
            const res = await axios(
                `${process.env.REACT_APP_BACKEND}/api/v1/auth/epcr`
            )

            // Check if status code = 200 and build menu (authorized)
            if (res.status === 200) {
                buildCheck()
            } else if (res.status === 401) {
                console.info("Not authorized to access epcr issue tracker function")
            } else {
                console.error("Unhandled return code checking for epcr issue manager:\t" + res.status)
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    console.log("Unauthorized: Access is denied due to invalid credentials.");
                } else {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Error status: " + error.response.status);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log("No response received");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
        }
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


    //BuildCheck build check menu items based on backend data and update state
    const buildCheck = () => {
        const menuItem = {
            id: "epcrissue",
            label: "Problemi ePCR",
            icon: 'pi pi-fw pi-ticket',
            command: (event) => componentToggle(event.item.id)
        }
        // Add menu item to menu items list at the right place (under check submenu)
        setMenuItems(prev => prev.map(i => (
            i.label === "Check"
                ? {...i, items: [...i.items || [], menuItem] }
                : i
        )))
        // Build new component item and add to component to display array
        const componentItem = {
            id: 'epcrissue',
            comp: EpcrIssue,
            // props: {},
            visible: true
        }
        setCompToDisplay(prev => [...prev, componentItem])
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

    const openLinkInNewTab = () => {
        window.open(`${process.env.REACT_APP_BACKEND}/issuedashboard/`)
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