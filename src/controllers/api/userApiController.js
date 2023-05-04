const db = require('../../database/models')



module.exports = {
    list:  (req, res) => {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;
        
        db.User.findAndCountAll({
            limit : limit,
            offset : offset,
        })
        .then(users => {
            const totalPages = Math.ceil(users.length / limit); 
            users = users.rows.map(user => {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  detail: "http://localhost:3000/api/users/" + user.id
                };
              });
            

            let respuesta = {
                meta: {
                    status : 200,
                    total: users.length,
                    url: 'api/users',
                    users: users,
                    page: page,
                    totalPages
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