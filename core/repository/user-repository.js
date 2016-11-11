var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    DirectoryserviceConfigDao = require("core/dao/directoryservice-config-dao").DirectoryserviceConfigDao,
    UserDao = require("core/dao/user-dao").UserDao;

exports.UserRepository = AbstractRepository.specialize({

    init: {
        value: function(userDao, directoryserviceConfigDao) {
            this._userDao = userDao || UserDao.instance;
            this._directoryserviceConfigDao = directoryserviceConfigDao || DirectoryserviceConfigDao.instance;
        }
    },

    listUsers: {
        value: function() {
            var self = this,
                searchOrder;
            return this._directoryserviceConfigDao.get().then(function(config) {
                searchOrder = config.search_order;
                return self._userDao.find({origin: {directory: searchOrder[0]}});
            }).then(function(users) {
                var directories = searchOrder.slice(1);
                for (var i = 0, length = directories.length; i < length; i++) {
                    self._userDao.find({origin: {directory: directories[i]}});
                }
                return users;
            });
        }
    },

    findUserWithName: {
        value: function (username) {
            return this._userDao.find({username: username}).then(function (users) {
                return users[0];
            });
        }
    },

    saveUser: {
        value: function (user) {
            return this._userDao.save(user);
        }
    }

    
});
