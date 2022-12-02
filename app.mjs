import "./db.mjs";
import * as auth from "./auth.mjs";
import express from 'express';
import mongoose from "mongoose";
import session from 'express-session';
import cors from "cors";
import bodyParser from "body-parser";

import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "public");

// MIDDLEWARE
app.use(cors());
app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use(session({
  secret: 'test secret',
  resave: false,
  saveUninitialized: true,
}));

// require authenticated user for /reviews/add and /restaurants/add
app.use(auth.authRequired(['/api/addReview'], ['/api/addRestaurant']));

// make {{user}} variable available for all paths
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


// creating mongoose constructors
const Restaurant = mongoose.model("Restaurant");
const Review = mongoose.model("Review");

// API ENDPOINT HANDLERS
app.get("/api/role", (req, res) => {
  console.log(req.session.user);
  if(req.session.user && req.session.user.role === "admin") {
      res.json({adminRole: true});
  } else {
    res.json({adminRole: false});
  }
});

app.post("/api/addUser", (req, res) => {
  console.log("req.body: ", req.body);
  // setup callbacks for register success and error
  function success(newUser) {
    auth.startAuthenticatedSession(req, newUser, (err) => {
      if (!err) {
        res.json({status: "OK"});
      } else {
        res.json({error: err});
      }
    });
  }

  function error(err) {
    res.json({error: err}); 
  }

  // attempt to register new user
  auth.register(req.body.name, req.body.username, req.body.email, req.body.password, req.body.role, error, success);
});

app.post("/api/login", (req, res) => {
  // setup callbacks for login success and error
  function success(user) {
    auth.startAuthenticatedSession(req, user, (err) => {
      if(!err) {
        console.log("authenticated session started");
        res.json({status: "OK"});
      } else {
        res.json({error: 'error starting auth sess: ' + err}); 
      }
    }); 
  }

  function error(err) {
    res.send({error: 'Login unsuccessful'}); 
  }

  // attempt to login
  auth.login(req.body.username, req.body.password, error, success);
});

app.get("/api/restaurants", (req, res) => {
  Restaurant.find({}).sort({createdAt:-1}).exec((err, restaurants) => {
    console.log(restaurants);
    res.json(restaurants.map(restaurant => {
      return {name: restaurant.name, address: restaurant.address, rating: restaurant.rating, website: restaurant.website, phone: restaurant.phone, keywords: restaurant.keywords, reviews: restaurant.reviews};
    }));
  });
});

app.post("/api/addRestaurant", (req, res) => {
  console.log("req.body: ", req.body);
  new Restaurant({
    name: req.body.name,
    address: req.body.address,
    website: req.body.website,
    phone: req.body.phone,
    keywords: req.body.keywords
  }).save(err => {
    if(err) {
      console.log("error: ", err);
      res.json({error: err});
    } else {
      console.log("worked");
      res.json({status: "OK"});
    }
  });
});

app.post("/api/restaurantDetails", (req, res) => {
  console.log("req.body: ", req.body);
  Restaurant.find({name: req.body.restName}).exec((err, restaurant) => {
    console.log("Restaurant Here:", restaurant);
    res.json({name: restaurant.name, address: restaurant.address, website: restaurant.website, phone: restaurant.phone, keywords: restaurant.keywords, reviews: restaurant.reviews});
  });
});

app.post("/api/addReview", (req, res) => {
  new Review({
    rating: req.body.name,
    commentary: req.body.commentary
  }).save((err) => {
    if(err) {
      console.log(err);
      res.render("restaurants-add", {err: "Error in adding restaurant"});
    } else {
      res.redirect("/restaurants");
    }
  });
});



/*
// ROUTE HANDLERS
// replace with actual home page later
app.get('/', (req, res) => {
    res.redirect("/restaurants");
  });

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  // setup callbacks for register success and error
  function success(newUser) {
    auth.startAuthenticatedSession(req, newUser, (err) => {
      if (!err) {
        res.redirect('/');
      } else {
        res.render('error', {message: 'err authing???'}); 
      }
    });
  }

  function error(err) {
    res.render('register', err || {message: "Registration Unsuccessful"}); 
  }

  // attempt to register new user
  console.log(req.body);
  console.log("HERE");
  auth.register(req.body.username, req.body.email, req.body.password, req.body.role, error, success);
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  // setup callbacks for login success and error
  function success(user) {
    auth.startAuthenticatedSession(req, user, (err) => {
      if(!err) {
        res.redirect('/'); 
      } else {
        res.render('error', {message: 'error starting auth sess: ' + err}); 
      }
    }); 
  }

  function error(err) {
    res.render('login', err || {message: 'Login unsuccessful'}); 
  }

  // attempt to login
  auth.login(req.body.username, req.body.password, error, success);
});

app.get('/restaurants', (req, res) => {
    Restaurant.find({}).sort({name:1}).exec((err, restaurants) => {
      res.render('restaurants', {title: "Restaurants", restaurants: restaurants});
    });
  });


app.get('/restaurants/add', (req, res) => {
    // account for only admin users having this add option later
    if(req.session.user.role === "admin") {
      res.render('restaurants-add', {title: "Add Restaurants"});
    } else {
      res.redirect("/restaurants");
    }
});


app.post('/restaurants/add', (req, res) => {
    // account for only admin users having this add option later
    new Restaurant({
        name: req.body.name,
        location: req.body.location,
        website: req.body.website,
        phone: req.body.phone
    }).save((err) => {
        if(err) {
          console.log(err);
          res.render("restaurants-add", {err: "Error in adding restaurant"});
        } else {
          res.redirect("/restaurants");
        }
    });
});

// show restaurant details
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findOne({_id: req.params.id}, (err, restaurant) => {
    res.render("restaurant-detail", {restaurant: restaurant});
  });
});

app.get('/reviews', (req, res) => {
  Review.find({}).sort("-createdAt").exec((err, reviews) => {
    res.render('reviews', {title: "Reviews", reviews: reviews});
  });
});


app.get('/reviews/add', (req, res) => {
  // account for only user role users having this add option later
  res.render('reviews-add', {title: "Add Reviews"});
});


app.post('/reviews/add', (req, res) => {
  // account for only user role users having this add option later
  new Review({
      restaurant: req.body.restaurantName,
      rating: req.body.rating,
      commentary: req.body.commentary
  }).save((err) => {
      if(err) {
        console.log(err);
        res.render("reviews-add", {err: "Error in adding your review"});
      } else {
        res.redirect("/reviews");
      }
  });
});

// show review details
app.get('/reviews/:id', (req, res) => {
  Review.findOne({_id: req.params.id}, (err, review) => {
    res.render("review-detail", {review: review});
  });
});
*/

app.listen(process.env.PORT || 3000);
