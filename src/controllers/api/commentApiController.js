const { name } = require('ejs')
const db = require('../../database/models')

module.exports = {
    all: async (req, res) => {

        try {
            const comments = await db.Comment.findAll()

            const commentsList = comments.map((comment) => {
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
        const { id } = req.params
        try {
            const comment = await db.Comment.findByPk(id)
            let aComment = {
                id: comment.id,
                name: comment.name,
                content: comment.content
            }

            let respuesta = {
                meta: {
                    status: 200,
                    url: 'http:localhost3000/api/comment/' + id
                },
                data: aComment
            }
            res.json(respuesta);
        } catch (error) {
            console.log(error);
        }

    },
    create: async (req, res) => {
            const { name, content } = req.body;
        try {

            
            await db.Comment.create({
                name,
                content,
            });
            const response = {
                status: 201,
                url: 'http:localhost3000/api/comment/'
            }
            return res.json({ response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    edit: async (req, res) => {
        const { id } = req.params;
        const { name, content } = req.body;
        try {
          await db.Comment.update({ name, content }, { where: { id } });
          res.status(200).json({ message: "Comment updated successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      },
    erase: async (req,res)=>{
    const id = +req.params.id
    try {
        await db.Comment.destroy({ where: { id } });
        return res.status(200).json({ message: 'Elimination successful' });
      } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
      }    
    }

}