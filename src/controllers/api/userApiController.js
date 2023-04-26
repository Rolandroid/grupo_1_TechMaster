const { name } = require('ejs')
const db = require('../../database/models')



module.exports = {
    list: (req, res) => {
        db.User.findAll()
        .then(users => {
            users = users.map(user => {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  detail: "api/users/" + user.id
                };
              });
            

            let respuesta = {
                meta: {
                    status : 200,
                    total: users.length,
                    url: 'api/users',
                    users: users
                },
            };
                res.json(respuesta);
            }).catch(error=>{
                console.log(error);
            })
    },

    detail: (req, res) => {
    },


}