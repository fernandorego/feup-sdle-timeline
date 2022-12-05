import React from 'react';

export const Context = React.createContext();

Context.serverUrl = "http://127.0.0.1:8000";


Context.blockPage = () => {
    Context.setBlockUI(true);
}

Context.unblockPage = () => {
    Context.setBlockUI(false);
}