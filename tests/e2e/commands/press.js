var util = require('util');
var events = require('events');

function Press() {
    events.EventEmitter.call(this);
}

util.inherits(Press, events.EventEmitter);

Press.prototype.command = function(selector, cb) {
    var self = this;
    if (selector) {
        this.api.moveToElement(selector, 10, 10);
    }
    this.api
        .mouseButtonDown(0)
        .mouseButtonUp(0, function() {
            self.emit('complete');
        });

    return this;
};

module.exports = Press;
