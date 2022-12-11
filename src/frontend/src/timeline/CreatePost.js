import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Context } from "../context/context";
import { getRequest, postRequest } from "./../api/api";


export const CreatePostForm = (props) => {
	const [value, setValue] = useState("");
	const setTimeline = props.setTimeline;
	const timeline = props.timeline;
	var signature = "";

	const handleSubmit = (event) => {
        event.preventDefault();
		const url = Context.serverUrl + "/posts/create/";
		const signurl = Context.serverUrl +"/sign";

		


		postRequest(signurl,{
			privateKey: Context.private_key,
			post: value
		}).then((result) =>{
			signature = result.signature;
			

			postRequest(url, {
						username: Context.username,
						post: value,
						signature: signature,
					}).then((res) => {
						
						console.log(res);
						setTimeline([res.post, ...timeline]);
						Context.toast.current.show({
							severity: "success",
							summary: res.message,
							life: 3000,
						});
				});
		})

		

		
	};

	return (
		<form onSubmit={handleSubmit}>
			<div >
				<InputTextarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="What's on your mind?"
					className="mt-4"
					rows={5}
					cols={30}
					autoResize
				/>
			</div>

			<div className="d-flex h-100 justify-content-center align-items-center mt-2">
				<Button type="submit" label="Submit" />
			</div>
		</form>
	);
};
