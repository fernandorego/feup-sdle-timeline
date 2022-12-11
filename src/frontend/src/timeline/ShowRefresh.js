import React, { useState } from "react";
import { Button } from "primereact/button";
import { Context } from "../context/context";
import { postRequest } from '../api/api';

const HandleYes = () => {
    const [timeline, setTimeline] = useState(Context.user.timeline);
    Context.warning = false;
    const url = Context.serverUrl + "/refresh-timeline";
    postRequest(url, {
        username: Context.user.username,
    }).then((res) => {
        setTimeline(res.timeline)
        Context.toast.current.show({
            severity: "success",
            summary: res.message,
            life: 3000,
        });
    });
}

const HandleNo = () => {
    Context.warning = false;
}

export const ShowRefreshToast = (toastConfirm) => {
    toastConfirm.current.show({ severity: 'info', sticky: true, content: (
        <div className="flex flex-column" style={{flex: '1'}}>
            <div className="text-center">
                <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                <h4>New posts available</h4>
                <p>Click yes to refresh timeline</p>
            </div>
            <div className="grid p-fluid">
                <div className="col-6">
                    <Button type="button" label="Yes" onClick={HandleYes} className="p-button-success" />
                </div>
                <div className="col-6">
                    <Button type="button" label="No" onClick={HandleNo} className="p-button-secondary" />
                </div>
            </div>
        </div>
    ) });
}