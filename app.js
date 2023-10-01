const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({
    extended:true
}));

app.set("view engine", "ejs");


mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const userSchema = {
    email : String,
    password : String
};

const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
});

app.get("/logout", function(req, res) {
  res.render("login");
});


app.post("/register",(req,res)=>{
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save()
        .then(() => {
         //   console.log('Document saved successfully:', newUser);
            res.render("secrets");
          })
          .catch((error) => {
            console.error('Error saving document:', error);
          });
    });


    app.post("/login", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
      
        try {
          const foundUser = await User.findOne({ email: username }).exec();
      
          if (foundUser) {
            if (foundUser.password === password) {
              res.render("secrets");
            } else {
              res.send("Incorrect password");
            }
          } else {
            res.send("User not found");
          }
        } catch (err) {
          console.error(err);
          res.send("An error occurred");
        }
      });
      

app.listen(3000,()=>{
    console.log("port connected successfully");
})

