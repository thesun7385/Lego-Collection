/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Supachai Ruknuy Student ID: 121707228 Date: 14-Nov-2023
*
* Published URL: https://energetic-sun-hat-fawn.cyclic.app/
*
********************************************************************************/

// Set up express server
const legoData = require("./modules/legoSets");


const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

///////////////////////////////////////////////////////////////////////////////

// Middleware Configuration
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(__dirname + '/public'));


// User ejs template
app.set('view engine','ejs');

// Initialize lego sets
legoData.Initialize();


// Route to homepage.ejs - OK
app.get('/', (req, res) => {
    res.render("home");
});


// Update route for about.ejs - OK
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



///////////////////////////// Route for Assigment 5 ///////////////////////////////////

// Route to get the addSet.ejs view with themes
app.get('/lego/addSet', (req, res) => {
    legoData.getAllThemes()
        .then(themes => {
            res.render("addSet", { themes: themes });
        })
        .catch(error => {
            res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
});

// Route to post the form submission for adding a new Lego Set
app.post('/lego/addSet', express.urlencoded({ extended: true }), (req, res) => {
    const setData = {
        name: req.body.name,
        year: parseInt(req.body.year),
        num_parts: parseInt(req.body.num_parts),
        img_url: req.body.img_url,
        theme_id: parseInt(req.body.theme_id),
        set_num: req.body.set_num
    };

    legoData.addSet(setData)
        .then(() => {
            // Redirect to the /lego/sets route after successful addition
            res.redirect('/lego/sets');
        })
        .catch(error => {
            res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
});

// Route to get editSet.ejs
app.get('/lego/editSet/:num', (req, res) => {
    const setNum = req.params.num;

    Promise.all([
        legoData.getSetByNum(setNum),
        legoData.getAllThemes()
    ])
    .then(([set, themes]) => {
        // Render the 'editSet.ejs' template with the 'set', 'themes', and 'theme_id' data
        res.render("editSet", { set, themes, theme_id: set.theme_id });
    })
    .catch((error) => {
        // Handle any errors that may occur during data retrieval
        res.status(404).render("404", { message: `I'm sorry, we're unable to find what you're looking for: ${error}` });
    });
});


// Route to post editSet.ejs
app.post('/lego/editSet', (req, res) => {

    const setNum = req.body.set_num;

    legoData.editSet(setNum, req.body)
        .then(() => {
            // Redirect the user to the "/lego/sets" route on success
            res.redirect('/lego/sets');
        })
        .catch((error) => {
            // Render the "500" view with an appropriate error message on failure
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
        });
});


// Route to delete
app.get('/lego/deleteSet/:num', (req, res) => {
    const setNum = req.params.num;
  
    legoData.deleteSet(setNum)
      .then(() => {
        // Redirect the user to the "/lego/sets" route on successful deletion
        res.redirect('/lego/sets');
      })
      .catch((error) => {
        // Render the "500" view with an appropriate error message on failure
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
      });
  });



///////////////////////////////////////////////////////////////////////////////////////



// For a custom 404.js to handle error
app.use((req, res) => {
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});


// Get start the server
app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });