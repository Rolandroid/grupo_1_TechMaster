const express = require("express");
const app = express();
const path = require("path")
const port = 3000


app.use(express.static(path.join(__dirname,".","public")));
app.listen(port, () => console.log("Port " + port + " running"))



app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "home.html"))
});
app.get('/header', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "header.html"))
});
app.get('/footer', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "footer.html"))
});
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "login.html"))
});
app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "register.html"))
});
app.get('/carrito', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "carrito.html"))
});
app.get('/detalle', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "detalle.html"))
});
app.get('/resultados', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "resultados.html"))
});


