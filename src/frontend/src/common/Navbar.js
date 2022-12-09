import { React, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Following } from '../following/Following';
import { InputText } from 'primereact/inputtext';
import { Context } from '../context/context';
export default function Navbar() {

    const [state, setState] = useState({
        serverUrl: Context.serverUrl,
        username: Context.username
    });

    const onServerUrlChange = (e) => {
        setState({
            ...state,
            serverUrl: e.target.value,
        });
        Context.serverUrl = e.target.value;
    }

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => {
                window.location = "/";
            }
        },
    ];

    return (
        <Menubar
            model={items}
            start={
                <InputText placeholder="127.0.0.1:8000" type="text"
                    onChange={onServerUrlChange}
                    value={state.serverUrl} />
            }
            
            end={
                Context.user == null ? <></> : <Following />
            }
        />
    );

}
