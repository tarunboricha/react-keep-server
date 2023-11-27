import express from "express";
import mysql from "mysql";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser"

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended:true}));

app.use(cors({
  credentials : true,
  origin : "*"
}));

app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : "test",
});

connection.connect((error) => {
  if(error){
    throw error;
  }
  else{
    console.log("Node js server is connected to Online MySQL server");
  }
});


app.get("/notes/:userid", (request, response) => {
  const userid = request.params.userid;
  const sql_query = "SELECT * FROM notes WHERE user_id = ?;"
  console.log(sql_query + userid);
  connection.query(sql_query, [userid], (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send(result);
    }
  })
})

app.get("/users/:email/:pass", (request, response) => {
  const email = request.params.email;
  const password = request.params.pass;
  const sql_query = "SELECT * FROM users WHERE email = ? AND password = ?;"

  connection.query(sql_query, [email, password], (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send(result);
    }
  })
})

app.post("/notes", (request, response) => {
  const sql_query = "INSERT INTO notes (title, content, user_id) VALUES (?,?,?);"
  console.log(request.body.title,request.body.content,request.body.userID);
  console.log(sql_query);
  connection.query(sql_query, [request.body.title,request.body.content,request.body.userID],(error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send(result);
    }
  })
})

app.post("/users", (request, response) => {
  const sql_query = "INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?);"
  console.log(request.body.firstname,request.body.lastname,request.body.email,request.body.password);
  console.log(sql_query);
  connection.query(sql_query, [request.body.firstname,request.body.lastname,request.body.email,request.body.password],(error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send(result);
    }
  })
})

app.put("/notes", (request, response) => {
  const sql_query = "UPDATE notes SET title = ?, content = ? WHERE note_id = ?;"
  
  connection.query(sql_query, [request.body.title,request.body.content,request.body.note_id], (error, result) => {
    if(error){
      response.status(500).send(error);
    }
    else{
      response.status(200).send("User Account has been modified");
    }
  })
})

app.delete("/notes/:id", (request, response) => {
  const noteid = request.params.id;
  const sql_query = "DELETE FROM notes WHERE note_id = ?";

  connection.query(sql_query, [noteid], (error, result) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(result);
    }
  });
});


const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log("Node js server is running");
  // app.send('Hello');
});