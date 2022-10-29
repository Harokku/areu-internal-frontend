import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./DocsMenu.css"

import {PanelMenu} from "primereact/panelmenu";
import DocsSearch from "./DocsSearch";
import {Panel} from "primereact/panel";

const DocsMenu = props => {
        const [searchitems, setSearchItems] = useState([])
        const [menuItems, setMenuItems] = useState([])

        useEffect(() => {
                fetchData()
            }, []
        )

        // Build prime compliant autocomplete object
        const buildSearchItems = (rawData) => {
            // Filter out directory, we need only files to be processed
            let filtered = rawData.filter(e => !e.is_dir)

            const result = filtered.map(item => (
                {
                    label: item.display_name,
                    value: item.hash,
                }
            ))

            return result
        }

        // Build prime compliant menu object
        const buildMenuItems = (rawData) => {
            // Start with empty array
            let result = []
            // Filter out directory, we need only files to be processed
            let filtered = rawData.filter(e => !e.is_dir)
            const pathSeparator = "/"
            //FIXME: Non necessary due to backend generalization, remove after enough test
            /*// Detect if os is windows and set separator accordingly
            let pathSeparator = "/"
            if (navigator.appVersion.indexOf("Win")!==-1) pathSeparator="\\";*/

            // Reduce file items
            filtered.reduce((r, item) => {
                // Replace backend _ with whitespace on path, split it and reduce level by level
                item.category.replaceAll('_', ' ').split(pathSeparator).reduce((o, label, index, array) => {
                    // Check if next level exist and set to it or add an empty array to push in
                    let temp = (o.items = o.items || []).find(q => q.label === label)
                    // If actual level not exist add it
                    if (!temp) {
                        o.items.push(temp = {label})
                    }
                    // If at last item (path reconstructed) add file item and info
                    if (array[array.length - 1] === label) {
                        temp.items = temp.items || []
                        temp.items.push({
                            id: item.hash,
                            label: item.display_name,
                            icon: 'pi pi-file-pdf',
                            command: (event) => requireFile(event.item.id),
                        })
                    }
                    // Return actual level
                    return temp
                }, r)
                // Return item converted into menu element
                return r
            }, {items: result})

            return result
        }

        // Fetch data from backend (url from env)
        const fetchData = async () => {
            //console.info(process.env.REACT_APP_BACKEND)
            const res = await axios(
                `${process.env.REACT_APP_BACKEND}/api/v1/docs`
            )
            setSearchItems(buildSearchItems(res.data.data))
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
                <Panel className="p-m-2" header="Documenti">
                    <div className='p-pb-2'>
                        <DocsSearch searchList={searchitems} selectedCallback={requireFile}/>
                    </div>
                    <PanelMenu model={menuItems}/>
                </Panel>
            </>
        );
    }
;

DocsMenu.propTypes = {};

export default DocsMenu;