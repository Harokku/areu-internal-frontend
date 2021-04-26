import React, {useState, useEffect} from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import {PanelMenu} from "primereact/panelmenu";
import {isInaccessible} from "@testing-library/react";

const DocsMenu = props => {
        const [menuItems, setMenuItems] = useState([])

        useEffect(() => {
                fetchData()
            }, []
        )

        const buildMenuItems = (rawData) => {
            let result = []
            let filtered = rawData.filter(e => !e.is_dir)

            filtered.reduce((r, item) => {
                item.category.replaceAll('_', ' ').split('/').reduce((o, label, index, array) => {
                    let temp = (o.items = o.items || []).find(q => q.label === label)
                    if (!temp) {
                        o.items.push(temp = {label})
                    }
                    if (array[array.length - 1] === label) {
                        temp.items = temp.items || []
                        temp.items.push({
                            id: item.id,
                            label: item.display_name,
                            command: (event) => requireFile(event.item.id),
                        })
                    }
                    return temp
                }, r)
                return r
            }, {items: result})

            return result
        }

        // Fetch data from backend (url from env)
        const fetchData = async () => {
            const res = await axios(
                `${process.env.REACT_APP_BACKEND}/api/v1/docs`
            )
            //setRawData(res.data.data)
            //buildMenuItems(res.data.data)
            setMenuItems(buildMenuItems(res.data.data))
        }

        // Show downloaded blob in a new browser tab
        const showInBrowser = (blob) => {
            //let newBlob = new Blob([blob], {type: "application/pdf"})
            const data = URL.createObjectURL(blob)
            window.open(data, '_blank')
        }

        // Request file from server based on id
        const requireFile = (id) => {
            let url = `${process.env.REACT_APP_BACKEND}/api/v1/docs/serveById/${id}`
            return fetch(url, {
                method: 'GET',
            })
                .then(r => r.blob())
                .then(showInBrowser)
        }

        return (
            <>
                <PanelMenu model={menuItems} style={{maxWidth: '400px'}}/>
            </>
        );
    }
;

DocsMenu.propTypes = {};

export default DocsMenu;