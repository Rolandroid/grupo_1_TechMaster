const express = require("express");
const app = express();
const path = require("path")
const port = 3000


app.use(express.static(path.join(__dirname,".","public")));
app.listen(port, () => console.log("Port running"))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, ".", "views", "header.html"))
});