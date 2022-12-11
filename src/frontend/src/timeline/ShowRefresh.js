import React, { useState } from "react";
import { Button } from "primereact/button";
import { Context } from "../context/context";
import { getRequest } from '../api/api';

const HandleYes = (toastConfirm, setTimeline) => {
    Context.warning = false;
    const url = Context.serverUrl + "/refresh-timeline/" + Context.user.username;
    getRequest(url).then((res) => {
        console.log('res: ');
        console.log(res);
        console.log(res.timeline.timeline);
        setTimeline(res.timeline.timeline);
        Context.toast.current.show({
            severity: "success",
            summary: res.message,
            life: 3000,
        });
        toastConfirm.current.clear();
    });
}

const HandleNo = (toastConfirm) => {
    Context.warning = false;
    toastConfirm.current.clear();
}

export const ShowRefreshToast = (toastConfirm, setTimeline) => {
    toastConfirm.current.show({ severity: 'info', sticky: true, content: (
        <div className="flex flex-column" style={{flex: '1'}}>
            <div className="text-center">
                <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                <h4>New posts available</h4>
                <p>Click yes to refresh timeline</p>
            </div>
            <div className="col-12 justify-content-center d-flex">
                <div className="p-2">
                    <Button type="button" label="Yes" onClick={() => HandleYes(toastConfirm, setTimeline)} className="p-button-success" />
                </div>
                <div className="p-2">
                    <Button type="button" label="No" onClick={() => HandleNo(toastConfirm)} className="p-button-secondary" />
                </div>
            </div>
        </div>
    ) });
}