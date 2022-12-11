import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./style/bootstrap.min.css";
import  Navbar  from "./common/Navbar";
import "./App.css";
import { React, useRef, useState } from "react";
import { Context } from "./context/context";
import { BlockUI } from "primereact/blockui";
import Timeline from "./timeline/Timeline";
import Login from "./login/login";
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";

function App(props) {
	const isLoggedIn = props.isLoggedIn;

	const toast = useRef(null);
	Context.toast = toast;

	const toastConfirm = useRef(null);

	const [blockedPanel, setBlockUI] = useState(false);
	Context.setBlockUI = setBlockUI;

	const [username, setUsername] = useState();
	Context.username = username;

	const showConfirm = () => {
		toastConfirm.current.show({ severity: 'info', sticky: true, content: (
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

	if (!username) {
		return <div className="App h-100 w-100">
			<Navbar />
			<Toast ref={toast} position="bottom-right"/>
			<BlockUI
				blocked={blockedPanel}
				className="h-100 w-100"
				template={
					<div className="d-flex flex-column justify-content-center align-items-center text-white">
						<i
							className="pi pi-spin pi-spinner"
							style={{ fontSize: "10rem" }}
						/>
					</div>
				}
				fullScreen
			>
					<div className="h-100 w-100 d-flex justify-content-center align-items-center">
						<Login username={Context.username} setUsername={setUsername} />
					</div>
			</BlockUI>
		</div>
	}

	const source = new EventSource('http://localhost:5000/update/' + Context.username)
	source.onmessage = e => {
		showConfirm()
	}

	return (
		<div className="App h-100 w-100">
			<Navbar />
			<Toast ref={toast} position="bottom-right"/>
			<Toast ref={toastConfirm} position="bottom-center" />
			<BlockUI
				blocked={blockedPanel}
				className="h-100 w-100"
				template={
					<div className="d-flex flex-column justify-content-center align-items-center text-white">
						<i
							className="pi pi-spin pi-spinner"
							style={{ fontSize: "10rem" }}
						/>
					</div>
				}
				fullScreen
			>
				<Timeline />
			</BlockUI>
		</div>
	);
}

export default App;
