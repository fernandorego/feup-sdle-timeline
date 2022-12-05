import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Context } from '../context/context';
import { postRequest } from './../api/api';



export const CreatePost = () => {
    const [value, setValue] = useState('')

    return (
        <div>
            <div className="card">
                <h5>Auto Resize</h5>
                <InputTextarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} autoResize />
            </div>

            <div className="d-flex h-100 justify-content-center align-items-center">
                <Button type="button"
                onClick={() => {
                    const url = Context.serverUrl + "/posts/create";
                    postRequest(url, {
                        username: "nando",
                        tweet: "tweet test"
                    }).then((res) => {
                        Context.toast.current.show({ severity: 'success', summary: res, life: 3000 });
                    });
                }}>
                Post!
                </Button>
            </div>
        </div>
    )
}