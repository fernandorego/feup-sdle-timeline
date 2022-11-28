import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./style/bootstrap.min.css";
import './App.css';
import { getRequest } from './api/api';
import { React, useRef, useState } from 'react';
import { Context } from './context/context';
import Navbar from './common/Navbar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';


function App() {

  const toast = useRef(null);
  Context.toast = toast;

  const [blockedPanel, setBlockUI] = useState(false);
  Context.setBlockUI = setBlockUI;


  return (


    <div className="App h-100 w-100">
      <BlockUI blocked={blockedPanel}
        className="h-100 w-100"
        template={
          <div className="d-flex flex-column justify-content-center align-items-center text-white">
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem' }} />
          </div>
          }
        fullScreen >
        <Toast ref={toast} />
        <Navbar />
        <div className="d-flex h-100 justify-content-center align-items-center">
          <Button type="button"
            onClick={() => {
              const url = Context.serverUrl + "/hello";
              getRequest(url, null).then((res) => {
                toast.current.show({ severity: 'success', summary: res, life: 3000 });
              });
            }}>
            Hello world!
          </Button>
        </div>
      </BlockUI>
    </div>
  );
}

export default App;
