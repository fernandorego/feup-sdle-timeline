export const showConfirm = () => {
    toastBC.current.show({ severity: 'info', sticky: true, content: (
        <div className="flex flex-column" style={{flex: '1'}}>
            <div className="text-center">
                <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                <h4>New posts available</h4>
                <p>Click yes to refresh timeline</p>
            </div>
            <div className="grid p-fluid">
                <div className="col-6">
                    <Button type="button" label="Yes" className="p-button-success" />
                </div>
                <div className="col-6">
                    <Button type="button" label="No" className="p-button-secondary" />
                </div>
            </div>
        </div>
    ) });
}