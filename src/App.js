import './App.css';

// Prime imports
import PrimeReact from "primereact/api";

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import SideMenu from "./SideMenu";
import DocsMenu from "./DocsMenu";

function App() {

    // active ripple effect
    PrimeReact.ripple = true;

    return (
        <>
            <div className="p-grid p-p-2">
                <div className="p-col-fixed" style={{width: '200px'}}>
                    <SideMenu/>
                </div>
                <div className="p-col p-ml-2">
                    <DocsMenu/>
                </div>
            </div>
        </>
    );
}

export default App;
