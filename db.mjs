import mongoose from "mongoose";

import fs from 'fs';
import path from 'path';
import url from 'url';

// Restaurant schema draft
const RestaurantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: Number,
    website: String,
    phone: String,
    keywords: String,
    reviews: [{rating: String, commentary: String}]
})

// Review schema draft
const ReviewSchema = new mongoose.Schema({
    restaurant: String,
    rating: {type: Number, required: true},
    commentary: String
})

// User schema draft
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, unique: true, required: true},
    role: {type: String, enum: ["user", "admin"], required: true}
})

// register models
mongoose.model("User", UserSchema);
mongoose.model("Restaurant", RestaurantSchema);
mongoose.model("Review", ReviewSchema);


// setup connection to client
// is the environment variable, NODE_ENV, set to PRODUCTION? 
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = "mongodb://localhost/sh5572";
}
mongoose.connect(dbconf);