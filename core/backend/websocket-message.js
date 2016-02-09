var WebSocketMessage = exports.WebSocketMessage = function WebSocketMessage (namespace, name, args) {
    this.namespace = namespace;
    this.name = name;
    this.args = args;
};

WebSocketMessage.prototype.id = null;

WebSocketMessage.prototype.toString = WebSocketMessage.prototype.toJSON = function () {
    return JSON.stringify({
        namespace: this.namespace,
        name: this.name,
        id: this.id,
        args: this.args
    });
};
