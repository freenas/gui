var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");
    NotificationCenterModule = require("core/backend/notification-center"),
    Model = require("core/model/model").Model;

exports.WebUi = AbstractInspector.specialize({

    PROTOCOL_OPTIONS: {
        value: [
            {label: "HTTP", value: ["HTTP"]},
            {label: "HTTPS", value: ["HTTPS"]},
            {label: "HTTP + HTTPS", value: ["HTTP","HTTPS"]}
        ]
    },

    IPv4_OPTIONS: {
        value: []
    },

    IPv6_OPTIONS: {
        value: []
    },

    certificates: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            return Promise.all([
                this.application.systemService.getUi().then(function(uiData) {
                    self.config = uiData;
                    self._snapshotDataObjectsIfNecessary();
                }),
                this._sectionService.listCertificates().then(function (certificates) {
                    self.certificates = certificates.filter(self._isCertificate);
                }),
                this.application.systemService.getMyIps().then(function(ipData){
                    for (var i = 0; i < ipData.length; i++) {
                        if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ipData[i])) {
                            self.IPv4_OPTIONS.push(ipData[i]);
                        } else if(/!^[FE|fe]/.test(ipData[i])) {
                            self.IPv6_OPTIONS.push(ipData[i]);
                        }
                    }
                    self.IPv4_OPTIONS.unshift({label:"all", value: "0.0.0.0"});
                    self.IPv6_OPTIONS.unshift({label:"all", value: "::"});
                }),
                this.application.systemService.getAdvanced().then(function(systemAdvanced) {
                    self.systemAdvanced = systemAdvanced;
                })
            ]);
        }
    },

    save: {
        value: function() {
            var self = this;

            return Promise.all([
                this.application.systemService.saveAdvanced(this.systemAdvanced),
                this.application.systemService.saveUi(this.config)
            ]).then(function (tasks) {
                //FIXME:  task.taskPromise doesn't seem to work.
                self._scrubTaskId = tasks[1].taskId;
            });
        }
    },

    enterDocument: {
        value: function () {
            this.super();
            NotificationCenterModule.defaultNotificationCenter.addEventListener("taskDone", this);
        }
    },

    exitDocument: {
        value: function () {
            this.super();
            NotificationCenterModule.defaultNotificationCenter.removeEventListener("taskDone", this);
        }
    },

    handleTaskDone: {
        value: function (event) {
            if (this._scrubTaskId === event.detail.jobId) {
                this._scrubTaskId = 0;

                if (!event.detail.errorMessage) {
                    //TODO: move that part to the section service
                    //and check for delta with snapshoting.
                    var config = this.config,
                        protocol = config.webui_protocol[0],
                        isHttpProtocol = protocol === "HTTP",
                        isHttpsProtocol = protocol === "HTTPS",
                        url = isHttpProtocol ? "http://" :
                            isHttpsProtocol ? "https://" : void 0,

                        httpsPort = config.webui_https_port || 443,
                        httpPort = config.webui_http_port || 80,
                        port = isHttpProtocol ? httpPort : httpsPort,

                        ipv6 = config.ipv6,
                        ipv4 = config.ipv4,
                        ip = ipv6 || ipv4 || window.location.hostname;

                    if (url) {
                        window.location.href = url + ip + ":" + port;
                    }
                }
            }
        }
    },

    revert: {
        value: function() {
            this.config = _.cloneDeep(this._config);
            this.systemAdvanced = _.cloneDeep(this._systemAdvanced);
        }
    },

    _isCertificate: {
        value: function (cert) {
            return cert.type.startsWith("CERT");
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if(!this._config) {
                this._config = _.cloneDeep(this.config);
            }
            if (!this._systemAdvanced) {
                this._systemAdvanced = _.cloneDeep(this.systemAdvanced);
            }
        }
    }

});
