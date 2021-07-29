import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import {Panel} from "primereact/panel";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";


const TableData = props => {
    const [tableHeaders, setTableHeaders] = useState([])
    const [tableContent, setTableContent] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')

    useEffect(() => {
            fetchData()
        }, [props.content]
    )

    // Fetch data from backend (url from env)
    const fetchData = async () => {
        const res = await axios(
            `${process.env.REACT_APP_BACKEND}/api/v1/content/${props.content}`
        )
        setTableHeaders(res.data.keys)
        setTableContent(res.data.data)
    }

    return (
        <>
            <Panel className="p-d-flex" header={props.header}>
                <div className='p-pb-2'>
                    <div className="p-inputgroup">
                       <span className="p-float-label">
                            <InputText id="globalsearchtext" value={globalFilter}
                                       onChange={(e) => setGlobalFilter(e.target.value)}/>
                            <label htmlFor="globalsearchtext">Cerca...</label>
                        </span>
                        <Button icon="pi pi-times" className="p-button-danger"
                                onClick={() => setGlobalFilter('')}/>
                    </div>
                </div>
                <div className="card">
                    <DataTable value={tableContent}
                               resizableColumns columnResizeMode="expand"
                               globalFilter={globalFilter}>
                        {/*Map trough header and build column accordingly*/}
                        {tableHeaders.map((header, index) => (
                            <Column key={index} field={header}
                                    header={header[0].toUpperCase() + header.slice(1).toLowerCase()}/>
                        ))}
                    </DataTable>
                </div>
            </Panel>
        </>
    );
};

TableData.propTypes = {
    header: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
};

export default TableData;