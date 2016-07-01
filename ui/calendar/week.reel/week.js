var Component = require("montage/ui/component").Component;

/**
 * @class Week
 * @extends Component
 */
exports.Week = Component.specialize({

    // concurrentEvents: {
    //     get: function() {
    //         var self = this;
    //         var result = []
    //         self.events.forEach(function(event){
    //             var name = "" + event.hours + event.minutes +"";
    //             if (!result[name]) {
    //                 result[name] = {};
    //                 result[name].events = [];
    //             }
    //             result[name].events.push(event);
    //         });
    //         return result;
    //     }
    // },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {

            }
        }
    }
});
