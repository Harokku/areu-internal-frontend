import './App.css';

// Prime imports
import PrimeReact from "primereact/api";

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import logoAREU from './logoAreu2021.jpg'
import logoNUE from './logoNUE.png'
import {Divider} from "primereact/divider";
import ColumnContainer from "./ColumnContainer"
import {RecoilRoot} from "recoil";

function App() {

    // active ripple effect
    PrimeReact.ripple = true;

    return (
        <RecoilRoot>
            <div className='p-d-flex p-jc-center navposition'>
                <div className="avatar">
                    <img src={logoAREU}/>
                    <img src={logoNUE}/>
                </div>
                <h3 className='title'>SOREU Laghi - intranet</h3>
            </div>
            <Divider/>
            <ColumnContainer/>
        </RecoilRoot>
    );
}

export default App;
