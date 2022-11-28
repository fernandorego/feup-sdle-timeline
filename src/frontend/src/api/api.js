import axios from 'axios';
import { Context } from '../context/context';

export function getRequest(url, params) {

    
    
    return new Promise((resolve, reject) => {
        Context.blockPage();
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
            Context.unblockPage();
        }).catch(err => {
            Context.toast.current.show({ severity: 'error', summary: err.message, life: 3000 });
            reject(err);
            Context.unblockPage();
        });
    });
}

export function postRequest(url, params) {
    
    return new Promise((resolve, reject) => {
        Context.blockDialog();
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
                Context.unblockPage();
            })
            .catch(err => {
                Context.toast.current.show({ severity: 'error', summary: err.message, life: 3000 });
                reject(err.data)
                Context.unblockPage();
            });
    });
}


