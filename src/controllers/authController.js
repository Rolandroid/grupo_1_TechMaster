const db = require("../database/models");

module.exports = {
    loginAndRegisterGoogle: async (req, res) => {
    const {
        provider,
        emails: [{value:email}],
        photos:[{value:picture}],
      _json: { sub: googleId, given_name: name, family_name: surname},
    } = req.session.passport.user;

    try {
       
         const [{id,rolId}, isCreate]= await db.User.findOrCreate({
           where: {
             socialId : googleId,
           },
           defaults: {
             name,
             surname,
             email,
             avatar:picture,
             socialId: googleId,
             socialProvider:provider,
           },
         });
        const location = await db.Location.create({
          userId : id
        },)


         if(!isCreate){
            await location.destroy()
         }

         req.session.userLogin = {
            id,
            name,
            rol: rolId,
            /* socialId: googleId, */
        };

        res.cookie('TechMaster', req.session.userLogin, { maxAge: 1000 * 120 })

        res.redirect("/users/profile");

    } catch (error) {
        console.error
    }
  },
};
