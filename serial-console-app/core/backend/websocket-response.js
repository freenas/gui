exports.WebSocketResponse = function WebSocketResponse (rawResponse) {
    this.data = rawResponse.args;
    this.timestamp = !isNaN(rawResponse.timestamp) ? rawResponse.timestamp * 1000 : 0;

    //FIXME: Development purpose.
    this._rawResponse = rawResponse;
};
