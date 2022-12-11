import { Button } from "primereact/button";
import { Context } from "../context/context";

const handleYes = () => {
    // TODO: send request to refresh timeline
    Context.warning = false;
}

const handleNo = () => {
    Context.warning = false;
}

export const showRefreshToast = (toastConfirm) => {
    toastConfirm.current.show({ severity: 'info', sticky: true, content: (
        <div className="flex flex-column" style={{flex: '1'}}>
            <div className="text-center">
                <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                <h4>New posts available</h4>
                <p>Click yes to refresh timeline</p>
            </div>
            <div className="grid p-fluid">
                <div className="col-6">
                    <Button type="button" label="Yes" onClick={handleYes} className="p-button-success" />
                </div>
                <div className="col-6">
                    <Button type="button" label="No" onClick={handleNo} className="p-button-secondary" />
                </div>
            </div>
        </div>
    ) });
}