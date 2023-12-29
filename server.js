import express from "express";
import mysql from "mysql";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser"
import nodemailer from "nodemailer"

const app = express();
const server = http.createServer(app);
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "keeperapplication418@gmail.com",
    pass: "iomh vylv fnka zrxg",
  },
  debug: true, // Enable debugging output
  logger: true, // Enable logging to console
})

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  credentials: true,
  origin: "*"
}));

app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  else {
    console.log("Node js server is connected to Online MySQL server");
  }
});


app.post("/sendEmail", (request, response) => {
  console.log("Hello");
  console.log(request.body);
  let otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  var mailOptions = {
    to: request.body.email,
    subject: "Signup OTP",
    text: "Hello " + request.body.firstname + ", Your otp is " + otp + ". Please use this otp to successfully signup into the Keeper application."
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      response.status(500).send(error);
    }
    else {
      info.otp = otp;
      response.status(200).send(info);
    }
  });
});

app.get("/notes/:userid", (request, response) => {
  const userid = request.params.userid;
  const sql_query = "SELECT * FROM notes WHERE user_id = ?;";
  console.log(sql_query + userid);

  connection.query(sql_query, [userid], (error, result) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(result);
    }
  });
});

app.get("/users/:email/:pass", (request, response) => {
  //console.log(request);
  const email = request.params.email;
  const password = request.params.pass;
  const sql_query = "SELECT * FROM users WHERE email = ? AND password = ?;"

  connection.query(sql_query, [email, password], (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send(result);
    }
  })
})

app.get("/users/:email", (request, response) => {
  const email = request.params.email;
  const sql_query = "SELECT * FROM users WHERE email = ?;"

  connection.query(sql_query, [email], (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send(result);
    }
  })
})


app.post("/notes", (request, response) => {
  const sql_query = "INSERT INTO notes (title, content, user_id) VALUES (?,?,?);"
  console.log(request.body.title, request.body.content, request.body.userID);
  console.log(sql_query);
  connection.query(sql_query, [request.body.title, request.body.content, request.body.userID], (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send(result);
    }
  })
});

app.post("/users", (request, response) => {
  const sql_query = "INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?);"
  console.log(request.body.firstname, request.body.lastname, request.body.email, request.body.password);
  console.log(sql_query);
  connection.query(sql_query, [request.body.firstname, request.body.lastname, request.body.email, request.body.password], (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send(result);
    }
  })
})

app.put("/notes", (request, response) => {
  const sql_query = "UPDATE notes SET title = ?, content = ? WHERE note_id = ?;"

  connection.query(sql_query, [request.body.title, request.body.content, request.body.note_id], (error, result) => {
    if (error) {
      response.status(500).send(error);
    }
    else {
      response.status(200).send(result);
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
