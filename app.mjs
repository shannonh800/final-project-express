import "./db.mjs";
import * as auth from "./auth2.mjs";
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

// creating mongoose constructors
const Restaurant = mongoose.model("Restaurant");
const Review = mongoose.model("Review");

// API ENDPOINT HANDLERS
app.get("/api/role", (req, res) => {
  console.log("Checking role... req.session.user: ", req.session.user);
  console.log("Checking session... req.session: ", req.session);
  if(req.session.user && req.session.user.role === "admin") {
    res.json({adminRole: true});
  } else {
    res.json({adminRole: false});
  }
});

app.get("/api/restaurants", (req, res) => {
  Restaurant.find({}).sort({createdAt:-1}).exec((err, restaurants) => {
    res.json(restaurants.map(restaurant => {
      const ratingSum = restaurant.reviews.reduce((ratingSum, currentReview) => ratingSum + parseFloat(currentReview.rating), 0);
      const averageRating = (ratingSum / restaurant.reviews.length).toFixed(2);
      return {name: restaurant.name, address: restaurant.address, rating: averageRating, website: restaurant.website, phone: restaurant.phone, keywords: restaurant.keywords, reviews: restaurant.reviews};
    }));
  });
});

app.post("/api/addRestaurant", (req, res) => {
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
      res.json({status: "OK"});
    }
  });
});

app.post("/api/restaurantDetails", (req, res) => {
  Restaurant.find({name: req.body.restName}).exec((err, restaurants) => {
    res.json(restaurants.map(restaurant => {
      const ratingSum = restaurant.reviews.reduce((ratingSum, currentReview) => ratingSum + parseFloat(currentReview.rating), 0);
      const averageRating = (ratingSum / restaurant.reviews.length).toFixed(2);
      return {name: restaurant.name, address: restaurant.address, rating: averageRating, website: restaurant.website, phone: restaurant.phone, keywords: restaurant.keywords, reviews: restaurant.reviews}
    }));
  });
});

app.post("/api/addReview", (req, res) => {
  console.log(req.body);
  new Review({
    restaurant: req.body.restaurant,
    rating: req.body.rating,
    commentary: req.body.commentary
  }).save((err, review) => {
    if(err) {
      console.log(err);
      res.json({error: err});
    } else {
      const newReview = {rating: review.rating, commentary: review.commentary};
      Restaurant.findOne({name: review.restaurant}).exec((err, restaurant) => {
        console.log("Restaurant found: ", restaurant.name);
      })
      Restaurant.findOneAndUpdate({name: review.restaurant}, {$push: {reviews: newReview}}, (err, success) => {
        if(err) console.log(err);
        else console.log(success);
      });
      //console.log(Restaurant.find({name: review.restaurant}).select("reviews"));
      res.json({status: "OK"});
    }
  });
});

app.listen(process.env.PORT || 3000);
