import { React, useState } from 'react';
import { CreatePostForm } from "./CreatePost";
import { Context } from "./../context/context";
import { Post } from "./Post";
export default function Timeline() {
    const [timeline, setTimeline] = useState(Context.user.timeline);
    let timelineComponent = <> </>;
    if (timeline.length > 0) {
        timelineComponent = (
            timeline.map((post) =>
                <Post post={post} />
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
