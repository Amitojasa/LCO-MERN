
const express=require("express");

const app= express();

// const port =3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const port=8000;
app.get('/',(req,res) => {
    return res.send("<h1>Hello</h1>");
});
app.get('/login',(req,res) => {
    return res.send("<h1>Login</h1>");
});

app.get('/signout',(req,res) => {
    return res.send("<h1>Signout</h1>");
});

app.get('/hitesh',(req,res)=>{
    return res.send("Histesh uses intagram");
});


app.listen(port,()=> {
    console.log("Server is up and running...");
});