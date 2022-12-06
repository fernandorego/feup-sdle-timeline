const encoder = require('./encoder')

function saveUser(node, username, user){
    const usernameEncoded = encoder.encode(username);
    const userEncoded = encoder.encode(user);
    try {
        node.contentRouting.provide(encoder.createCID(username));
    } catch(error){
        console.error(`Error saving user: ${username}` + error);
    }
}

function getUser(node, username){
    
    const usernameEncoded = encoder.encode(username);
    try {
        const user = node.contentRouting.get(usernameEncoded);
        return user;
    } catch(error){
        console.error(`Error getting user: ${username}` + error);
    }
    return null;
}

function initUser(username){
    return {username: username, posts: [], following: []};
}


module.exports = { saveUser: saveUser, getUser: getUser, initUser: initUser };
