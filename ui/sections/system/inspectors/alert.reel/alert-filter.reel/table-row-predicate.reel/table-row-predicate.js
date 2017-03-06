var Component = require("montage/ui/component").Component,
    AlertService = require("core/service/alert-service").AlertService;

exports.TableRowPredicate = Component.specialize({
    templateDidLoad: {
        value: function () {
            var self = this;
            this._service = AlertService.instance;
            this._service.listAlertClasses().then(function (alertClasses) {
                self.classValues = alertClasses.map(function (x) {
                    return {
                        label: x.id,
                        value: x.id
                    };
                });
            });
            this._service.listAlertEmitters().then(function (alertEmitters) {
                self.alertEmitters = alertEmitters.args.fragment.map(function (x) {
                    return {
                        label: x.name,
                        value: x.name
                    }
                })
            })
        }
    }
});
