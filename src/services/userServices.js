const db = require('../database/models');

module.exports = {
    getAllUsers : async () => {

    },
    getUserById : async () => {

    },
    verifyUserByEmail : async (email) => {
        try {

            let user = await db.User.findOne({
                where : {
                    email
                }
            })

            return user ? true : false
            
        } catch (error) {
            console.log(error);
            throw{
                status : 500,
                message : error.message
            }
        }
    }
}