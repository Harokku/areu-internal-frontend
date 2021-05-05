import React, {useState} from 'react';
import DocsMenu from "./DocsMenu";
import ShiftMenu from "./ShiftMenu";
import SideMenu from "./SideMenu";

const ColumnContainer = (props) => {
    const [items, setItems] = useState([
            {id: 'documenti', comp: DocsMenu, props: null, visible: true},
            {id: 'turni', comp: ShiftMenu, props: {items: ['tecnici']}, visible: true},
        ]
    )

    // Toggle items based on menu selection
    const menuToggle = (id) => {
        let splitted = id.split('-')
        splitted.length > 1
            ? setItems(propToggle(splitted))
            : setItems(items.map(i =>
                i.id === splitted[0]
                    ? {...i, visible: !i.visible}
                    : i
            ))
    }

    // Check is clicked menu item is present in props array and toggle it
    // Hide block if props is null
    const propToggle = (splittedId) => (
        items.map(i => {
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
            <div className="p-grid p-p-2 p-d-flex p-flex-wrap">
                <div className="p-col-fixed" style={{width: '200px'}}>
                    <SideMenu menuToggleCallback={menuToggle}/>
                </div>
                {items.map(item => {
                    if (item.visible) {
                        return (
                            <div key={item.id} className="p-col p-ml-2" style={{minWidth: '475px'}}>
                                {React.createElement(item.comp, item.props, null)}
                            </div>
                        )
                    }
                })}
            </div>
        </>
    )
};

export default ColumnContainer;