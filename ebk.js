var express = require('express');
const fileUpload = require("express-fileUpload");
var bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require('cors');
var app = express();
const path=require("path")
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = 8000
app.use(express.static(path.join(__dirname, 'index.html')))

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'id20593960_root',
    password: '68&hp5{2zr>+ObvO',
   database : "id20593960_ebk",
})

app.get('/', function (Request, Response) {
    Response.sendFile(path.join(__dirname, 'index.html'))
})

app.post("/add/audio", (Request, Response) => {
    if (Request.files == null) { return Response.status(400).send({ pmsg: "no files uploaded" }); }
    const file = Request.files.file;
    const Audiofile = file.name
    file.mv("uploads/" + file.name, (err) => {
        if (err) { console.log(err)
            return Response.status(500).send(err)
        }  Response.json({ filename: file.name })
    });
   connection.query("INSERT INTO audio(audio)VALUES(?)", [ Audiofile], (err, result) => {
        if (err) { console.log("The error msg", err)
        } else {  }
    })
});


app.get("/audio", (Request, Response) => {
connection.query("SELECT * FROM audio", (err, results) => {
if (err) { console.log(err) }
else {
    console.log("nooooo")
    Response.send(results)
}
});
});

app.get("/audio/get/:id", (Request, Response) => {
const id=Request.params.id
connection.query("SELECT audio FROM audio WHERE id=?",[id], (err, results) => {
    if (err) { console.log(err) }
    else { Response.send(results)}
});
});

app.post("/audio/likes/:newLikes/:id", (Request, Response) => {
const like = Request.params.newLikes;
const id = Request.params.id;
connection.query("UPDATE audio SET likes='"+like+"' WHERE id='"+id+"' ", [like,id], (err, result) => {
if (err) { Response.send({ errorMsg: err })
    } else { Response.send({ Msg: "sucess" })}})
})

app.post("/audio/stream/:newStream/:id", (Request, Response) => {
const like = Request.params.newStream;
const id = Request.params.id;
connection.query("UPDATE audio SET stream='"+like+"' WHERE id='"+id+"' ", [like,id], (err, result) => {
if (err) { Response.send({ errorMsg: err })
    } else { Response.send({ Msg: "sucess" })}
    })})

app.post("/add/comment", (Request, Response) => {
    const name = Request.body.sname;
    const comment = Request.body.name;
    const num=Request.body.newNum
    const id = Request.body.id;
    const stat="unread"
    connection.query("INSERT INTO comment (name ,comment ,id,status )VALUES(?,?,?,?)", [name,comment,id,stat ], (err, result) => {
        if (err) { Response.send({ errorMsg: err })} else {
connection.query("UPDATE audio SET comment='"+num+"' WHERE id='"+id+"' ", [num,id], (err, result) => {
if (err) {Response.send({ errorMsg: err })
} else { Response.send({ Msg: "sucess" })
}})}})});


app.get("/comment/:id", (Request, Response) => {
 const id = Request.params.id;
connection.query("SELECT * FROM comment WHERE id=?",[id], (err, results) => {
if (err) { console.log(err) }
else {Response.send(results)}});});

app.get("/commentid/:mid", (Request, Response) => {
const id = Request.params.mid
connection.query("SELECT * FROM comment WHERE id=?",[id], (err, results) => {
if (err) { console.log(err) }
else {Response.send(results)}});});

app.post("/status", (Request, Response) => {
const like = "read";
const id = Request.body.id;
connection.query("UPDATE comment SET status='"+like+"' WHERE cid='"+id+"' ", [like,id], (err, result) => {
if (err) {Response.send({ errorMsg: err })
} else { Response.send({ Msg: "sucess" })}
    })})


app.post("/del", (Request, Response) => {
const id = Request.body.mid;
connection.query("DELETE from audio WHERE id='"+id+"' ", [id], (err, result) => {
if (err) {Response.send({ errorMsg: err })
} else {Response.send({ Msg: "sucess" })}})
})

app.post('/cm', (Request, Response) => {
    const id = Request.body.id;
    connection.query("SELECT COUNT(comment)as sumtotal FROM comment WHERE id = ? ", [id], (err, result, rows) => {
        if (err) { Response.send({ error: err }) } else { Response.send({ total: result[0].sumtotal })
        } })})

//app.listen(8000, () => { console.log("Listen Port 8000  currently Activated ......."); });
app.listen(process.env.PORT||PORT, () => { console.log("Listen Port 8000 0r diff  currently Activated ......."); });

