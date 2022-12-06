let userManager = require("./userManager")

let node = undefined;
async function initNode(port){
    discovery = require("../discovery/discovery.js");
    node = await discovery.startNode(port);
}
function getNode(){
    return node;
}

function getOrCreateUser(username){
    let user = userManager.getUser(node, username);
    if(user == null){
        user = userManager.initUser(username);
        userManager.saveUser(node, username, user);
    }
    return user;
}





module.exports = { initNode: initNode, getNode: getNode, getOrCreateUser: getOrCreateUser };