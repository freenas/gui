var util = require('util');
var events = require('events');

function Login() {
    events.EventEmitter.call(this);
}

util.inherits(Login, events.EventEmitter);

Login.prototype.command = function(cb) {
    var self = this;
    this.api
        .waitForElementVisible('div[data-montage-id=owner].SignIn', 10000)
        .setValue('input[data-montage-id=userName]', 'root')
        .setValue('input[data-montage-id=password]', 'root')
        .moveToElement('button[data-montage-id=submit].SignIn-submit', 10, 10)
        .mouseButtonDown(0)
        .mouseButtonUp(0)
        .waitForElementNotVisible('div[data-montage-id=owner].SignIn', 10000)
        .pause(2000, function() {
            self.emit('complete');
        })

    return this;
};

module.exports = Login;

