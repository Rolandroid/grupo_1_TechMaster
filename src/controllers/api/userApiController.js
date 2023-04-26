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
        db.User.findByPk(req.params.id)
            .then(user => {
                let usuario = {
                    name:user.name,
                    surname:user.surname,
                    email:user.email,
                    avatar:`http://localhost:3000/Images/users/${user.avatar}`,
                    createdAt:user.createdAt,
                    updatedAt:user.updatedAt
                }
                
                let respuesta = {
                    meta: {
                        status: 200,
                        total: user.length,
                        url: '/api/actor/:id'
                    },
                    data: user
                }
                res.json(usuario);
            }).catch(error=>{
                console.log(error);
            });
    },


}