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
