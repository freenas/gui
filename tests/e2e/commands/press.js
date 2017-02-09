var util = require('util');
var events = require('events');

function Press() {
    events.EventEmitter.call(this);
}

util.inherits(Press, events.EventEmitter);

function scrollToEntry(selector) {
    if (selector) {
        var targetElement = document.documentElement.querySelector(selector),
            offset = {
                top: targetElement.getBoundingClientRect().top - 50,
                left: targetElement.getBoundingClientRect().left - 150
            },
            needHorizontal = offset.left < 0,
            scrollview,
            candidate = targetElement;
        while (!scrollview && candidate) {
            candidate = candidate.parentElement;
            if (candidate.classList.contains(needHorizontal ? 'Scrollview-is-horizontal' : 'Scrollview') && candidate.component) {
                scrollview = candidate;
            }
        }
        if (scrollview) {
            if (needHorizontal) {
                scrollview.component.scrollLeft = offset.left;
            } else {
                scrollview.component.scrollTop = offset.top;
            }
        }
    }
}

Press.prototype.command = function(selector, cb) {
    var self = this;
    self.api.execute(scrollToEntry, [selector], function(result) {
        if (selector) {
            self.api.moveToElement(selector, 10, 10);
        }
        self.api
            .mouseButtonDown(0)
            .mouseButtonUp(0, function() {
                self.emit('complete');
            });
    });

    return this;
};

module.exports = Press;
