import { React, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Context } from '../context/context';
import { postRequest } from '../api/api';
export function Following() {

    let op = useRef(null);

    const [users, setUsers] = useState(Context.user.following);

    const [usernameToFollow, setUsernameToFollow] = useState('');
    const followUser = () => {
        const url = Context.serverUrl + "/follow";
        postRequest(url, {
            username: Context.user.username,
            target_username: usernameToFollow,
        }).then((res) => {
            Context.user.following.push(usernameToFollow);
            setUsers(Context.user.following);
            setUsernameToFollow('');

            Context.toast.current.show({ severity: 'success', detail: 'User added to followed', life: 3000 });

        });
    };

    const unfollowUser = (user) => {
        const url = Context.serverUrl + "/unfollow";
        postRequest(url, {
            username: Context.user.username,
            target_username: user,
        }).then((res) => {
            Context.user.following = Context.user.following.filter((u) => u !== user);
            setUsers(Context.user.following);

            Context.toast.current.show({ severity: 'success', detail: 'User unfollowed', life: 3000 });
        });
    };
    return (
        <>
            <Button type="button"
                onClick={(e) => op.current.toggle(e)}>
                <span className="p-ml-2">Following</span>
            </Button>
            <OverlayPanel
                ref={op}>
                <div className="p-grid">
                    <div className="p-col-12">
                        <h4>Following</h4>
                    </div>
                    <div className="p-col-12 d-flex flex-column">
                        {users.map((user) =>
                            <div key={user} className="col-12 d-flex">
                                <div key={user} className="col-10 py-1">
                                    User:{user}
                                </div>
                                <div className="col-2 ps-2">
                                    <Button icon="pi pi-user-minus "
                                    onClick={() => unfollowUser(user)}
                                    className="p-button-danger p-button-rounded" />
                                    
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-col-12 mt-4">
                        <h6>Follow new user</h6>
                        <div className='d-flex align-items-center'>
                            <InputText
                                value={usernameToFollow}
                                onChange={(e) => setUsernameToFollow(e.target.value)}
                                type="text"
                                placeholder="Username to follow"
                                className='col-10' />
                            <div className='col-2 ps-2'>
                                <Button icon="pi pi-user-plus"
                                    iconPos="right"
                                    onClick={followUser} />
                            </div>
                        </div>
                    </div>
                </div>
            </OverlayPanel>
        </>
    );

}