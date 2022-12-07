export function Post(props) {
    const post = props.post;
    return (
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">{post.post}</h5>
                <p className="card-text">{post.timestamp}</p>
            </div>
        </div>
    );
}