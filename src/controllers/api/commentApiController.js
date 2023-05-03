const { name } = require('ejs')
const db = require('../../database/models')

module.exports = {
    all: async (req, res) => {

        try {
            const comments = await db.Comment.findAll()

            const commentsList = comments.map((comment)=>{
               return {
                id: comment.id,
                name: comment.name,
                content: comment.content,
                }
            })
            let respuesta = {
                meta: {
                    status: 200,
                    total: commentsList.length,
                    url: 'api/products',
                    comments: commentsList
                },
            };
            res.json(respuesta);
            
        } catch (error) {
            console.log(error)
        }
    },

    one: async (req, res) => {
        const {id} = req.params
        try {
           const comment = await db.Comment.findByPk(id)
        let aComment = {
            id : comment.id,
            name: comment.name,
            content: comment.content
        }

        let respuesta = {
            meta: {
                status: 200,
                url: 'http:localhost3000/api/comment/:id'
            },
            data: aComment
        }
        res.json(respuesta);
       } catch (error) {
        console.log(error);
       }
            
    }


}