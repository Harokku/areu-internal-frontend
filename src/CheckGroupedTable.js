import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "./CheckConvention.css"

const CheckGroupedTable = props => {
    const [expandedRows, setExpandedRows] = useState([]);

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="image-text">{data.convenzione}</span>
            </React.Fragment>
        );
    }

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="2" style={{textAlign: 'right'}}>Postazioni
                    totali: {calculateCustomerTotal(data.convenzione)}</td>
            </React.Fragment>
        );
    }
    const calculateCustomerTotal = (conv) => {
        let total = 0;

        if (props.content) {
            for (let item of props.content) {
                if (item.convenzione === conv) {
                    total++;
                }
            }
        }

        return total;
    }

    return (
        <>
            <div className="datatable-rowgroup p-m-2">

                <div className="card">
                    <h3 className="title">{props.title}</h3>
                    <p>Raggruppati per convenzione in ordine di postazione</p>
                    <DataTable value={props.content} rowGroupMode="subheader" groupField="convenzione"
                               sortMode="single" sortField="convenzione" sortOrder={1}
                               expandableRowGroups expandedRows={expandedRows}
                               onRowToggle={(e) => setExpandedRows(e.data)}
                               rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate}
                               onRowSelect={(e) => props.onMoveItem(e)} selectionMode="single"
                               dataKey="id"
                    >
                        <Column field="ente" header="Associazione"/>
                        <Column field="minimum" header="Eq minimo"/>
                        <Column field="stazionamento" header="Stazionamento"/>
                    </DataTable>
                </div>

            </div>
        </>
    );
};

CheckGroupedTable.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    position: PropTypes.oneOf(["left", "right"]).isRequired,
    onMoveItem: PropTypes.func
};

export default CheckGroupedTable;