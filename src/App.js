import './App.css';

// Prime imports
import PrimeReact from "primereact/api";

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import SideMenu from "./SideMenu";
import logo from './logoAreu2021.jpg'
import {Avatar} from "primereact/avatar";
import {Divider} from "primereact/divider";
import ColumnContainer from "./ColumnContainer"

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
            <ColumnContainer/>
        </>
    );
}

export default App;
