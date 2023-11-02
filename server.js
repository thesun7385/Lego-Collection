/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Supachai Ruknuy Student ID: 121707228 Date: 31-Oct-2023
*
* Published URL: https://energetic-sun-hat-fawn.cyclic.app/
*
********************************************************************************/

// Set up express server
const legoData = require("./modules/legoSets");
const express = require('express');
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Set static folder
app.use(express.static(__dirname + '/public'));

// User ejs template
app.set('view engine','ejs');

// Initialize lego sets
legoData.Initialize();


// Route to homepage.ejs
app.get('/', (req, res) => {
    res.render("home");
});


// Update route for about.ejs
app.get('/about', (req, res) => {
    res.render("about");
});


// Update route for sets.ejs
app.get('/lego/sets', (req, res) => {
 
    const theme = req.query.theme; // query parameter

    if (theme) {
        legoData.getSetsByTheme(theme)
            .then(legoSets => {
                // Render the 'sets.ejs' template with the 'legoSets' data
                res.render("sets", {sets: legoSets});
                //console.log(legoSets); // see theme collection
            })
            .catch(error => {
                // Handle any other errors that may occur during data retrieval
                res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
            });
    } else {
        legoData.getAllsets()
            .then(legoSets => {
                // Render the 'sets.ejs' template with the 'legoSets' data
                res.render("sets", {sets: legoSets});
                //console.log(legoSets); // see the all collections
            })
            .catch(error => {
                // Handle any other errors that may occur during data retrieval
                res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
            });         
    }
  
});


// Invoking the function with a known setNum value from your data set.
app.get('/lego/sets/:set_num', (req, res) => {
    const setNum = req.params.set_num;

    legoData.getSetByNum(setNum)
        .then(legoSet => {
            if (legoSet) {
                res.render("set", {set: legoSet});
                //console.log(legoSet); // see the
            } else {
                res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
            }
        })
        .catch(error => {
            // Handle any other errors that may occur during data retrieval
            res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
        });
});


// for a custom 404.js to handle error
app.use((req, res) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});


// Get start the server
app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
