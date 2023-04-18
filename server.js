const express =require('express');
const bodyParser =require("body-parser");
const cookieParser =require("cookie-parser");
const mongoose =require("mongoose");
const bcrypt =require('bcrypt');
const cors =require('cors');
const jwt =require('jsonwebtoken');
const path =require('path');

const secret = 'secret123';

const TodoSchema = new mongoose.Schema({
  text:{type:String,required:true},
  done:{type:mongoose.SchemaTypes.Boolean,required:true},
  user:{type:mongoose.SchemaTypes.ObjectId},
});

const Todo = mongoose.model('Todo', TodoSchema);

const UserSchema = new mongoose.Schema({
  email: {type:String,unique:true},
  password: {type:String},
});

const User = mongoose.model('User', UserSchema);

mongoose.connect('mongodb+srv://sarthak:nodeuser@cluster0.8hik3.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true});
const db = mongoose.connection;
db.on('error', console.log);

const app = express();
const PORT = process.env.PORT || 8080
app.use(express.static(path.join(__dirname + "/public")))
app.use(cookieParser());
app.use(bodyParser.json({extended:true}));
app.use(cors({
  credentials:true,
  origin: 'http://localhost:8080',
}));

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/user', (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id)
    .then(userInfo => {
      if (!userInfo) {
        return res.json({});
      }
      res.json({id:userInfo._id,email:userInfo.email});
    });
});

app.post('/register', (req, res) => {
  const {email,password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({password:hashedPassword,email});
  user.save().then(userInfo => {
    jwt.sign({id:userInfo._id,email:userInfo.email}, secret, (err,token) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
      }
    });
  });
});

app.post('/login', (req, res) => {
  const {email,password} = req.body;
  User.findOne({email})
    .then(userInfo => {
      if (!userInfo) {
        return res.sendStatus(401);
      }
      const passOk = bcrypt.compareSync(password, userInfo.password);
      if (passOk) {
        jwt.sign({id:userInfo._id,email},secret, (err,token) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
          }
        });
      } else {
        res.sendStatus(401);
      }
    })
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').send();
});

app.get('/todos', (req,res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Todo.where({user:new mongoose.Types.ObjectId(payload.id)})
    .find((err,todos) => {
      res.json(todos);
    })
});

app.put('/todos', (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const todo = new Todo({
    text:req.body.text,
    done:false,
    user:new mongoose.Types.ObjectId(payload.id),
  });
  todo.save().then(todo => {
    res.json(todo);
  })
});

app.post('/todos', (req,res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  Todo.updateOne({
    _id:new mongoose.Types.ObjectId(req.body.id),
    user:new mongoose.Types.ObjectId(payload.id)
  }, {
    done:req.body.done,
  }).then(() => {
    res.sendStatus(200);
  });
});

app.listen(PORT);