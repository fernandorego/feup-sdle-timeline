import { React, useState } from 'react';
import Navbar from "./../common/Navbar";
import { CreatePostForm } from "./CreatePost";

export default function Timeline() {
    return (
        <div>
            <Navbar />
            <div className="d-flex h-100 justify-content-center align-items-center">
                <CreatePostForm />
            </div>
        </div>
    );

}
