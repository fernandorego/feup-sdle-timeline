import React, { useState } from 'react';
import Navbar from "./../common/Navbar";
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Context } from "../context/context";
import { postRequest } from "./../api/api";


export default function Login({ setUsername, setPrivate_key }) {
    const [username, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("key : "+Context.private_key);
        const url = Context.serverUrl + "/login";
		postRequest(url, {
			username: username,
            password: password,
		}).then((res) => {
            Context.user = res.user;
            Context.user.timeline = res.timeline.timeline;
			Context.toast.current.show({
				severity: "success",
				summary: res.message,
				life: 3000,
			});
            setUsername(username);
            setPrivate_key(res.private_key);
            

		});
	};

    return (
        <div>
            <div className="d-flex h-100 justify-content-center align-items-center">
                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <h5>Login</h5>
                        <InputText value={username} placeholder='username' onChange={(e) => setName(e.target.value)} />
                        <InputText value={password} placeholder='password' type='password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="d-flex h-100 justify-content-center align-items-center mt-2">
                        <Button type="submit" label="Submit" />
                    </div>
                </form>
            </div>
        </div>
    );
}
