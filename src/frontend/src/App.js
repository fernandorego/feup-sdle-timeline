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


function App(props) {
	const isLoggedIn = props.isLoggedIn;

	const toast = useRef(null);
	const toastConfirm = useRef(null);
	Context.toast = toast;

	const [blockedPanel, setBlockUI] = useState(false);
	Context.setBlockUI = setBlockUI;

	const [username, setUsername] = useState();
	Context.username = username;

	const [private_key, setPrivate_key] = useState();
	Context.private_key = private_key;

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
						<Login username={Context.username} setUsername={setUsername} private_key={Context.private_key} setPrivate_key={setPrivate_key} />
					</div>
			</BlockUI>
		</div>
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
				<Timeline toastConfirm={toastConfirm}/>
			</BlockUI>
		</div>
	);
}

export default App;
