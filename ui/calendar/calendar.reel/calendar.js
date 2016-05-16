var Component = require("montage/ui/component").Component;

/**
 * @class Calendar
 * @extends Component
 */
exports.Calendar = Component.specialize({
    events: {
        value: [
            {
                date: "March 15th, 2016",
                events: [
                    {
                        title: "Replicate Pool 2",
                        time: "11:00am",
                        type: "REPLICATION"
                    },
                    {
                        title: "Update Drives",
                        time: "4:00pm",
                        type: "UPDATE"
                    }
                ]
            },
            {
                date: "April 6th, 2016",
                events: [
                    {
                        title: "SMART Task",
                        time: "5:00am",
                        type: "SMART"
                    },
                    {
                        title: "RSYNC",
                        time: "12:00pm",
                        type: "RSYNC"
                    },
                    {
                        title: "Blow up everything",
                        time: "6:00pm",
                        type: "SCRUB"
                    }
                ]
            },
            {
                date: "April 25th, 2016",
                events: [
                    {
                        title: "Snapshot Pool Bar",
                        time: "8:00am",
                        type: "SNAPSHOT"
                    }
                ]
            },
            {
                date: "May 1st, 2016",
                events: [
                    {
                        title: "Snapshot Pool Foo",
                        time: "4:00pm",
                        type: "SNAPSHOT"
                    },
                    {
                        title: "RSYNC Foo",
                        time: "5:00pm",
                        type: "RSYNC"
                    },
                    {
                        title: "Blow up everything again",
                        time: "6:00pm",
                        type: "SCRUB"
                    }
                ]
            }

        ]
    },
    taskObjects: {
        value: [
            { name: "rsync" },
            { name: "scrub" },
            { name: "replication" },
            { name: "smart" },
            { name: "update" },
            { name: "snapshot" }
        ]
    }
});
