export function Post(props) {
    const post = props.post;
    
    return (
        <div  className="card mt-4">
            <div className="card-title m-0">
                <h5>{post.username}</h5>
            </div>
            <div className="card-body p-1">
                <h5 className="card-title">{post.post}</h5>
                <p className="card-text">{post.timestamp}</p>
            </div>
        </div>
    );
}