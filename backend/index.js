const express = require('express');
const port =  8000;
const app = express();
const db = require('./config/mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const adminPassport = require('./config/passport');
const departmentPassport = require('./config/department_passport');
const details = require('./routes/constants');
const cors = require('cors')
const path = require('path');
const connectDB = require('./config/mongoose');

app.use(express.json());
app.use(express.urlencoded());

// const allowedOrigins = ['http://localhost:3000',"https://seminar.rohankm.online"];

// const corsOptions ={
//     origin:allowedOrigins, 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }

connectDB()

const whitelist = ['http://localhost:3000']; // Only allow local frontend

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));


app.set('trust proxy', 1)
app.use(session({
  secret: "yourSecretKey", // Change this to a strong secret key
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      mongoUrl: `mongodb+srv://sudharsan6078:123@cluster0.xo0jy.mongodb.net/seminarHall`,
      collectionName: "sessions"
  }),
  cookie: { secure: false } // Set `true` if using HTTPS
}));


app.use(adminPassport.initialize())
app.use(adminPassport.session())
app.use(departmentPassport.initialize())
app.use(departmentPassport.session())



app.use('/api',require('./routes/index'));


const rootPath = __dirname.substring(0, __dirname.length - 8);
// app.use(express.static(""));
app.use(express.static(rootPath + '/frontend/build'));
// Any other routes should be handled by the React app
app.get('/', (req, res) => {
  res.sendFile(rootPath + '/frontend/build/index.html');
  res.send("Api working...")
});



app.listen(port , (err)=>{
    if(err){
        console.log("Error while starting the server ",err);
        return;
    }
    console.log("Server is up and running on port : ",port);

})