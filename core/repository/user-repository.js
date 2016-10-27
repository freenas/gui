var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    UserDao = require("core/dao/user-dao").UserDao;

exports.UserRepository = AbstractRepository.specialize({

    init: {
        value: function(userDao) {
            this._userDao = userDao || UserDao.instance;
        }
    },

    findUserWithName: {
        value: function (username) {
            return this._userDao.list().then(function (users) {
                for (var i = 0, length = users.length; i < length; i++) {
                    if (users[i].username === username) {
                        return users[i];
                    }
                }
            });
        }
    },

    saveUser: {
        value: function (user) {
            return this._userDao.save(user);
        }
    }

    
});
