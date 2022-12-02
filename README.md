# A Foodie's Guide

## Overview

Living in New York City--or any major city, for that matter--means countless of food options, which is ideal for the foodie but perhaps not ideal for the indecisive and risk-averse. Without knowing what a restaurant sells or if its food is any good, making a decision on where to go for dinner can be a challenge, but that's where A Foodie's Guide comes in!

A Foodie's Guide is a web app that allows users to search up a restaurant and see its details in terms of what it sells, its menu, hours, etc., but most importantly, other users' reviews of it. It also provides a map function, so users can bookmark their favorite spots or places they've been meaning to go to later and visualize it in a more convenient manner--useful when trying to decide on a spot in a specific area. For an admin, they can go in and add more restaurants to the app, along with their respective information, so that newly opened places are included in the app and delete those that have closed.


## Data Model

The application will store Users, Restaurants, and SavedPlaces

* users can have multiple SavedPlaceLists (via references) based on the category they want to save those places (ex: "Favorites", "Want to go", "Bad Experiences", "Nicer Places", "Quick Options", etc.)
* each SavedPlaceList can have multiple Restaurants (by reference)
* users can also have multiple Reviews (via references) that they've written for different places
* Restaurants is an array of all the restaurant documents (to display when users want to browse restaurant options / search for a specific restaurant)
* each Restaurant object

An Example User:

```javascript
{
  username: "shannonlovesfood",
  hash: // a password hash,
  role: "User" // could also be "Admin"
  SavedPlaces: // an array of references to SavedPlaceList documents
  Reviews: // an array of references to Review documents
}
```

An Example SavedPlaceList:

```javascript
{
  user: // a reference to a User object
  name: "Favorites",
  numPlaces: 3,
  places: // an array of Restaurant documents
}
```

An Example Restaurant:

```javascript
{
  savedPlaceList: // a reference to a SavedPlaceList
  name: "Ruby's Cafe",
  location: "198 E 11th St",
  rating: 4.5,
  website: "https://littlerubyscafe.com/",
  phone: "(646) 998-4265"
}
```

An Example Review:

```javascript
{
  user: // a reference to a user document
  Restaurant: // a reference to a Restaurant document
  rating: 1.3,
  commentary: "Worst food ever!! Everything was bland and dry... plus, the waiter was extremely rude for no reason"
}
```

An Example Restaurants:

```javascript
{
  restaurants: // an array of Restaurant documents
}
```


## First Draft Schema
[Link to Commented First Draft Schema](db.mjs)


## Wireframes

/restaurants - user page for viewing restaurants, optionally filtered page

![user restaurants view](documentation/restaurants_view.png)

/restaurants/sonnyboy - user page for viewing an individual restaurant (ex: sonnyboy)

![user individual restaurant view](documentation/individual_restaurant_view.png)

/restaurants - admin page for viewing restaurants, optionally filtered page

![admin restaurants view](documentation/admin_restaurants_view.png)

/restaurants/sonnyboy - admin page for viewing an individual restaurant (ex: sonnyboy)

![admin individual restaurant view](documentation/admin_individual_restaurant_view.png)

/saved_places - page for showing all lists of saved places

![saved_places](documentation/saved_places_view.png)

/saved_places/favorites - page for showing a specific list of saved places

![favorites](documentation/favorites.png)

/reviews - page for showing all the user's posted reviews

![reviews](documentation/reviews.png)

/profile - page for showing user's profile

![profile](documentation/profile.png)



## Site maps

[Users Site Map](documentation/users_site_map.png)

![Users Site Map](documentation/users_site_map.png)

[Admin Site Map](documentation/admin_site_map.png)

![Admin Site Map](documentation/admin_site_map.png)


## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can search for a specific restaurant to see its information and reviews
4. as a user, I can browse a list of all restaraunts in NYC, or a filtered list based on set criteria
5. as a user, I can add a restaurant to a personal saved list of places so I can revisit it later without having to remember myself
6. as a user, I can view the restaurants on a map to better visualize the location
7. as a user, I can write a review for a restaurant so I can share my experience with others
8. as an admin, I can add or delete restaurants to keep the list of all restaurants updated, if any newly opened or closed down

## Research Topics
* (6 points) Use a front-end framework
    * Front-end frameworks are a piece of software that provides some sort of foundation that developers can build off of through ready-to-use code and speeds up the development process.
    * I'll be using Vue as my front-end framework for this project. It's an open-source framework designed for interactive user interfaces. Since it's lightweight and user-friendly--with all the documentation out there--I figured this would be a good framework to start with, as I don't have any prior experience. It's also really flexible, which is nice since I want to have more control over the actual design of my app.
    * There are several ways to integrate Tailwind CSS into a Vue app, but I'll probably install Tailwind through a Vue CLI app, as it's the most straightforward method that does a lot of stuff for you already.
* (2 points) Use a CSS framework or UI toolkit
    * CSS frameworks / UI toolkits can be useful in designing the user interface in terms of aesthetics and any user interactions.
    * For this, I'm planning on using Tailwind CSS, as it gives the biggest flexibility. I briefly used Bootstrap before, but I wasn't a huge fan of the look so I'd appreciate being able to customize elements based on design choices I make myself. Tailwind CSS also comes with a lot of useful features, like hover states, and pseudo-classes, that I can definitely see myself implementing. Lastly, it seems that Tailwind CSS integrates well with a lot of front-end frameworks, like Vue--which I'm planning to use--so that fact that it doesn't include Javascript isn't too big of an issue.
* (3 points) Perform client side form validation using custom JavaScript or JavaScript library
errors must be integrated into the DOM


**11 points total** out of **10 required points**


## Initial Main Project File
[Link to Initial Main Project File](app.mjs)

## Annotations / References Used
No references for code built yet, but the following references were used for the research section:

1. [Top 6 Frontend Frameworks](https://www.telerik.com/blogs/top-6-frontend-frameworks-2022)
2. [Best Frontend Frameworks](https://www.velvetech.com/blog/best-frontend-frameworks/)
3. [CSS Frameworks & UI Toolkits Comparison](https://ckcollab.com/2021/02/02/Tailwind-vs-Bootstrap-vs-Semantic-UI.html)
4. [Getting Started with Tailwind in Vue](https://www.thisdot.co/blog/getting-started-with-tailwind-in-vue)

# Milestone #2 & #3:
## Two working forms
Made a form for adding a restaurant to the app. Can be accessed by going to "/restaurants/add" or going to "/restaurants" and clicking on the "Add Restaurant" hyperlink. After submitting a form, the new restaurant will show up on the "/restaurants" home page.

Also made a form for adding a review to the app. Can be accessed by going to "/reviews/add" or going to "/reviews" and clicking on the "Add A Review" hyperlink. After submitting a form, the new review will show up on the "/reviews" page.

## Progress on research topics
Started looking into Tailwind CSS and set up a App.vue file with some Tailwind CSS code in it for "Adding Restaurant" and "Adding a Review" pages

[Tailwind CSS Start](App.vue)

## Deployment
On linserv1.cims.nyu.edu... port 34815


## Things to Fix / Implement
* login functionality
  * checking that only admins can add restaurants, only users can add reviews / check "my reviews" / check & add to "saved lists", and anyone can view restaurants
* populate the restaurant & user fields of each Review document so that we can access the restaurant & user documents when displaying the reviews (need restaurant name) and displaying individual restaurants (need user names for the reviews)
* restaurants page that allows for search functionality based on restaurant name or key word that matches a word in a restaurant's description
* restaurant shows overview of restaurant + all the reviews for that restaurant
* my reviews shows all of the user's posted reviews

IF TIME:
* saved lists functionality for users

NEED HELP WITH
* how to set up vue app for multiple pages (/, /restaurants, /register, /login, /reviews) (do i just create multiple separate vue apps in vscode and then run build on each of them)?
* if doing ^^, how do i access the variables from the backend in my frontend template?
* and how do i post after a form is submitted?
* tailwind css giving errors in index.css file

* database updating array property of a document
  * ex: when a review is created, want to push that review to the reviews field of the associated restaurant...
  would i just do
  new Review({
      restaurant: req.body.restaurantName,
      rating: req.body.rating,
      commentary: req.body.commentary
  }).save((err, review) => {
      if(!err) {
        Restaurant.findOne({name: req.body.restaurantName}, (err, restaurant) => restaurant.reviews.push(review??));
      }
  });

* for only allowing users to add reviews, would i do something like this:
  app.get('/reviews/add', (req, res) => {
    if(req.session.user.role === "user") {
      res.render('article-add');
    } else {
      res.redirect("/login");
    }
  });


* higher-order functions
  * calculating average rating for a restaurant:
    * when a review is created, do Review.find({}, (err, reviews) => {reviews.reduce()}) to get the average rating of all the reviews and update the restaurant rating with that number
  * maybe search function for restaurants where you use filter based on Restaurant.find({}, (err, restaurants) => {restaurants.filter(keyword)})# final-project-express
