var Montage = require("montage").Montage;

exports.CalendarCustomSchedule = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/cron-job.reel'
            },
            nameExpression: "'Custom Schedule Options'"
        }
    }
});
