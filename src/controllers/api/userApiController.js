const db = require('../../database/models')
const {verifyUserByEmail} = require('../../services/userServices');


module.exports = {
    list: async (req, res) => {
       try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;
        
            const userlist = await db.User.findAndCountAll({
              limit: limit,
              offset: offset, 
            });
        
            const users = userlist.rows.map(user => {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                detail: `http://localhost:3000/api/users/${user.id}`,
              };
            });
        
            const meta = {
              status: 200,
              total: userlist.count,
              page: page,
              pages: Math.ceil(userlist.count / limit),
              url: '/api/users',
            };
        
            const response = {
              meta: meta,
              data: users,
            };
        
        res.json(response);
        
       } catch (error) {
            console.log(error);
       }
       
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
    verifyEmail : async (req,res) => {
      try {

          let existUser = await verifyUserByEmail(req.body.email);

          return res.status(200).json({
              ok : true,
              data : {
                  existUser
              }
          })

      } catch (error) {
          console.log(error)
          return res.status(error.status || 500).json({
              ok : false,
              error : {
                  status : error.status || 500,
                  message : error.message || "Upss, hubo un error"
              }
          })
      }
  }

}