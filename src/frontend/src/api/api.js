import axios from 'axios';
import { Context } from '../context/context';


function canShowDetail(err) {
    const cond = (err.response != undefined && (err.response.status === 404 || err.response.status === 400));
    return cond;
}

export function getRequest(url, params) {
    return new Promise((resolve, reject) => {
        Context.blockPage();
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
            Context.unblockPage();
        }).catch(err => {
            console.log(err);
            Context.toast.current.show({ severity: 'error', summary: canShowDetail(err) ? err.response.data.detail : err.message, life: 3000 });
            reject(err);
            Context.unblockPage();
        });
    });
}

export function postRequest(url, body) {
    return new Promise((resolve, reject) => {
        Context.blockPage();
        axios.post(url, body)
            .then(res => {
                resolve(res.data);
                Context.unblockPage();
            })
            .catch(err => {
                console.error(err);
                Context.toast.current.show({ severity: 'error', summary: canShowDetail(err) ? err.response.data.detail : err.message, life: 3000 });
                reject(err.data)
                Context.unblockPage();
            });
    });
}


