import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "./CheckConvention.css"

const CheckGroupedTable = props => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [selectedItems, setSelectedItems] = useState();

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="image-text">{data.conv_type}</span>
            </React.Fragment>
        );
    }

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan="2" style={{textAlign: 'right'}}>Postazioni
                    totali: {calculateCustomerTotal(data.conv_type)}</td>
            </React.Fragment>
        );
    }
    const calculateCustomerTotal = (conv) => {
        let total = 0;

        if (props.content) {
            for (let item of props.content) {
                if (item.conv_type === conv) {
                    total++;
                }
            }
        }

        return total;
    }

    const addMover = (position) => {
        if (position === "left") {
            return <Column header="" headerStyle={{width: '3em'}}
                           body={() => <i className="pi pi-chevron-right" style={{'fontSize': '2em'}}/>}/>
        }
    }
    const reMover = (position) => {
        if (position === "right") {
            return <Column header="" headerStyle={{width: '3em'}}
                           body={() => <i className="pi pi-chevron-left" style={{'fontSize': '2em'}}/>}/>
        }
    }

    // Cell selection logic
    const onCellSelect = (event) => {
        console.log(`${event.data.id} ${event.data.name}: ${event.data.conv_type}`)
    }

    const onCellUnselect = (event) => {
        console.log(`${event.data.id} ${event.data.name}: ${event.data.conv_type}`)
    }


    return (
        <>
            <div className="datatable-rowgroup p-m-2">

                <div className="card">
                    <h3 className="title">{props.title}</h3>
                    <p>Raggruppati per convenzione in ordine di postazione</p>
                    <DataTable value={props.content} rowGroupMode="subheader" groupField="conv_type"
                               sortMode="single" sortField="conv_type" sortOrder={1}
                               expandableRowGroups expandedRows={expandedRows}
                               onRowToggle={(e) => setExpandedRows(e.data)}
                               rowGroupHeaderTemplate={headerTemplate} rowGroupFooterTemplate={footerTemplate}
                               onRowSelect={(e) => props.onMoveItem(e)} selectionMode="single"
                               dataKey="id"
                    >
                        {/*{reMover(props.position)}*/}
                        <Column field="conv_type" header="Convenzione"/>
                        <Column field="name" header="Postazione"/>
                        {/*{addMover(props.position)}*/}
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