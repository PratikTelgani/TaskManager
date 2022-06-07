const express = require('express');
const app = express();
const mongodb = require('mongodb');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');


mongoose.connect('mongodb://localhost/TaskManager');
let db = mongoose.connection;
db.once('open', ()=>{
    console.log('Connected to DB...');
});


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

//BodyParser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})
); 
app.use(flash())
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
})

// const { on } = require('./models/Task');

let Task = require('./models/Task');



app.get('/', (req, res)=>{
    Task.find({}, (err, tasks)=>{
      if(err){
        console.log(err);
      }
      else{
          res.render('index', {
          task: tasks
        })
      }
  })   
})

app.post('/', (req, res)=>{
  let newTask = new Task;
  let errors=[]
  newTask.task = req.body.task;
  newTask.save((err)=>{
    if(err){console.log(err)}
    else{
      req.flash("success_msg", "Task Added Succesfully!");
      res.redirect('/');
    }
  }) 
}) 


app.get('/:id', (req, res)=>{

  Task.findOne({_id:req.params.id}, (err, task)=>{
    if(err){console.log(err)}
    else{
      console.log(task)
      res.render('editTask', {
        task: task
      });
    }
  })
});

app.post('/:id', (req, res)=>{
  var delBody = req.body.delete
  var checkBody = req.body.completed

  if(checkBody == 'on' && delBody != 'on'){
    Task.updateOne({_id:req.params.id},{$set: {completed: true}}, (err, updateTask)=>{
      if(err){
        console.log("Error occured: ",err)
      }
      else{
          req.flash("success_msg", "Task completed...!!");
          res.redirect('/')
      }
    })   
  }
  else if(delBody == 'on'){
    Task.deleteOne({_id:req.params.id}, (err, doc)=>{
      if(err){console.log(err)
      }else{
        req.flash("success_msg", "Task Deleted");
        res.redirect('/')
      }
    })
    
  }
  else{
    req.flash("error_msg", "Error!!");
    res.redirect('/')
  }
})







app.listen(3000, console.log('Server started on port 3000...'));