/*global require, exports, Error*/
require('vendors/string');

var ModelDescriptorService = require('core/service/model-descriptor-service').ModelDescriptorService,
    TopologyService = require('core/service/topology-service').TopologyService,
    BootEnvironmentService = require('core/service/boot-environment-service').BootEnvironmentService,
    ConsoleService = require('core/service/console-service').ConsoleService,
    CalendarService = require('core/service/calendar-service').CalendarService,
    FilesystemService = require('core/service/filesystem-service').FilesystemService,
    StatisticsService = require('core/service/statistics-service').StatisticsService,
    PeeringService = require('core/service/peering-service').PeeringService,
    ReplicationService = require('core/service/replication-service').ReplicationService,
    RsyncdModuleService = require('core/service/rsyncd-module-service').RsyncdModuleService,
    SessionService = require('core/service/SessionService').SessionService,
    SystemService = require('core/service/system-service').SystemService,
    ApplicationContextService = require('core/service/application-context-service').ApplicationContextService,
    WidgetService = require('core/service/widget-service').WidgetService,
    ShareService = require('core/service/share-service').ShareService,
    AccountsService = require('core/service/accounts-service').AccountsService,
    BytesService = require('core/service/bytes-service').BytesService,
    ValidationService = require('core/service/validation-service').ValidationService,
    PowerManagementService = require('core/service/power-management-service').PowerManagementService,
    NtpServerService = require('core/service/ntp-server-service.js').NtpServerService,
    SectionsDescriptors = require('data/sections-descriptors.json'),
    Montage = require('montage').Montage;

var FakeMontageDataService = require('core/service/fake-montage-data-service').FakeMontageDataService;

exports.ApplicationDelegate = Montage.specialize({
    willFinishLoading: {
        value: function (app) {
            app.dataService = FakeMontageDataService.getInstance();

            app.modelDescriptorService = this.modelDescriptorService = ModelDescriptorService.getInstance();

            app.topologyService = TopologyService.instance;
            app.bootEnvironmentService = BootEnvironmentService.instance;
            app.calendarService = CalendarService.instance;
            app.consoleService = ConsoleService.instance;

            app.filesystemService = FilesystemService.instance;
            app.statisticsService = StatisticsService.instance;
            app.peeringService = PeeringService.instance;
            app.replicationService = ReplicationService.getInstance();
            app.rsyncdModuleService = RsyncdModuleService.instance;
            app.sessionService = SessionService.getInstance();
            app.systemService = SystemService.getInstance();
            app.shareService = ShareService.instance;
            app.accountsService = AccountsService.instance;
            app.applicationContextService = ApplicationContextService.instance;
            app.widgetService = WidgetService.instance;
            app.validationService = ValidationService.instance;
            app.bytesService = BytesService.instance;
            app.powerManagementService = PowerManagementService.getInstance();
            app.ntpServerService = NtpServerService.instance;

            app.sectionsDescriptors = SectionsDescriptors;

            app.isDrawerOpen = false;
        }
    },

    getUserInterfaceDescriptorForType: {
        value: function (modelType) {
            var objectType = modelType.typeName || modelType;
            return this.modelDescriptorService.getUiDescriptorForType(objectType);
        }
    },

    userInterfaceDescriptorForObject: {
        value: function (object) {
            return this.modelDescriptorService.getUiDescriptorForObject(object);
        }
    }

});
