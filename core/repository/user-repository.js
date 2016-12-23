var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DirectoryserviceConfigDao = require("core/dao/directoryservice-config-dao").DirectoryserviceConfigDao,
    UserDao = require("core/dao/user-dao").UserDao;

exports.UserRepository = AbstractRepository.specialize({

    init: {
        value: function() {
            this._userDao = new UserDao();
            this._directoryserviceConfigDao = new DirectoryserviceConfigDao();
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    listUsers: {
        value: function() {
            var self = this,
                searchOrder;
            return this._directoryserviceConfigDao.get().then(function(config) {
                searchOrder = config.search_order;
                return self._userDao.find({origin: {directory: searchOrder[0]}}, true);
            }).then(function(users) {
                var directories = searchOrder.slice(1);
                Promise.all(directories.map(function(x) {
                    return self._userDao.find({origin: {directory: x}}, true);
                })).then(function() {
                    self._eventDispatcherService.dispatch("userLoaded");
                });
                return users;
            });
        }
    },

    findUserWithName: {
        value: function (username) {
            return this._userDao.findSingleEntry({username: username}).then(function (users) {
                return users[0];
            });
        }
    },

    saveUser: {
        value: function (user) {
            return this._userDao.save(user);
        }
    },

    getNewUser: {
        value: function() {
            return this._userDao.getNewInstance();
        }
    }

});
