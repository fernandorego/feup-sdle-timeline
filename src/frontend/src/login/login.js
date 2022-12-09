import React, { useState } from 'react';
import Navbar from "./../common/Navbar";
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Context } from "../context/context";
import { postRequest } from "./../api/api";


export default function Login({ setUsername }) {
    const [username, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = Context.serverUrl + "/login";
		postRequest(url, {
			username: username,
		}).then((res) => {
            Context.user = res.user;
            Context.user.timeline = res.timeline;
			Context.toast.current.show({
				severity: "success",
				summary: res.message,
				life: 3000,
			});
            setUsername(username);
		});
	};

    return (
        <div>
            <div className="d-flex h-100 justify-content-center align-items-center">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <h5>Username</h5>
                        <InputText value={username} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="d-flex h-100 justify-content-center align-items-center mt-2">
                        <Button type="submit" label="Submit" />
                    </div>
                </form>
            </div>
        </div>
    );
}
