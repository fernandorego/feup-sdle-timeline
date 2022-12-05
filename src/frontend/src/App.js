import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./style/bootstrap.min.css";
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
	Context.toast = toast;

	const [blockedPanel, setBlockUI] = useState(false);
	Context.setBlockUI = setBlockUI;

	const [username, setUsername] = useState();
	Context.username = username;

	if (!username) {
		return <div>
			<Toast ref={toast} />
			<Login setUsername={setUsername} />;
			</div>
	}

	return (
		<div className="App h-100 w-100">
			<Toast ref={toast} />
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
