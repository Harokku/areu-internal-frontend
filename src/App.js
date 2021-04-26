import './App.css';

// Prime imports
import PrimeReact from "primereact/api";

import 'primereact/resources/themes/saga-blue/theme.css';
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
            <div className="p-grid">
                <div className="p-col-fixed" style={{width: '200px'}}>
                    <SideMenu/>
                </div>
                <div className="p-col">
                    <DocsMenu/>
                </div>
            </div>
        </>
    );
}

export default App;
