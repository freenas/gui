var WebSocketMessage = exports.WebSocketMessage = function WebSocketMessage (namespace, name, args) {
    this.namespace = namespace;
    this.name = name;
    this.args = args;
    this.id = null;
};

WebSocketMessage.prototype.id = null;
