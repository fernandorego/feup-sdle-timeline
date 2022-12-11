import { React, useState, useRef } from 'react';
import { CreatePostForm } from "./CreatePost";
import { Context } from "./../context/context";
import { Post } from "./Post";
import { Toast } from 'primereact/toast';
import { ShowRefreshToast } from "./ShowRefresh"
export default function Timeline(props) {

    const toastConfirm = props.toastConfirm;
    let source = Context.source;
    if(Context.source == undefined){
        source = new EventSource('http://localhost:5000/update/' + Context.username);
        Context.source = source;
    }
	const [timeline, setTimeline] = useState(Context.user.timeline);
    source.onmessage = e => {
		if (Context.warning == false) {
			Context.warning = true;
            ShowRefreshToast(toastConfirm, setTimeline);
		}
	}

    
    let timelineComponent = <> </>;
    if (timeline.length > 0) {
        timelineComponent = (
            timeline.map((post, i) =>
                <Post key={`post-${i}`} post={post} />
            )
        );
    }
    return (
        <div className="w-100 h-100 d-flex flex-column  justify-content-start align-items-center">
            <div className="col-4">
                <CreatePostForm setTimeline={setTimeline} timeline={timeline}/>
            </div>
            <div className="w-100 d-flex align-items-center flex-column ">
                <h1 className='mt-4 p-text-secondary'>Timeline</h1>
                <div className='col-12 col-sm-10 col-md-6  '>
                    {timelineComponent}
                </div>
            </div>
        </div>
    );
}