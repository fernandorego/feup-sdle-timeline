import React from 'react';

export const Context = React.createContext();

Context.serverUrl = "http://127.0.0.1:5000";
Context.username = "";
Context.warning = false;
Context.private_key = "";

Context.blockPage = () => {
    Context.setBlockUI(true);
}

Context.unblockPage = () => {
    Context.setBlockUI(false);
}