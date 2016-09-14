/**
 * @module ui/tunable.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Tunable
 * @extends Component
 */
exports.Tunable = Component.specialize(/** @lends Tunable# */ {

    templateDidLoad: {
        value: function (){
            var self = this;
            this.application.dataService.fetchData(Model.Tunable).then(function (tunables) {
                self.tunables = tunables;
            });
        }
    }
});
