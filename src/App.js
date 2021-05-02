import './App.css';

// Prime imports
import PrimeReact from "primereact/api";

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import SideMenu from "./SideMenu";
import DocsMenu from "./DocsMenu";
import logo from './logoAreu2021.jpg'
import {Avatar} from "primereact/avatar";
import {Divider} from "primereact/divider";

function App() {

    // active ripple effect
    PrimeReact.ripple = true;

    return (
        <>
            <div className='p-d-none p-d-sm-flex p-ai-center p-jc-center p-mt-1' style={{height: '50px'}}>
                <Avatar className='p-d-inline' image={logo} size='xlarge'/>
                <h1 className='p-d-inline p-pl-4' style={{fontFamily: 'Nunito'}}>Intranet SOREU Laghi</h1>
            </div>
            <Divider/>
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
