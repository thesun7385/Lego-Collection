/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Supachai Ruknuy Student ID: 121707228 Date:10-Oct-2023
*
********************************************************************************/

// Set up express server
const legoData = require("./modules/legoSets");
const express = require('express');
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

////// Mark public folder as static///////////
app.use(express.static(__dirname + '/public'));

legoData.Initialize();


///// Update for Assignment 3 ///

// Update route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Update route for about
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// // Update route for 404 error
// app.get('/404', (req, res) => {
//     res.sendFile(__dirname + '/views/404.html');
// });

// This route is responsible for responding with all of the Lego sets
app.get('/lego/sets',(req,res) => {
    const theme = req.query.theme; // query parameter

    if(theme)
    {
        legoData.getSetsByTheme(theme)
            .then(sets=>{
                res.json(sets);
            })
            .catch(error=>{
                res.status(404).send(error); // return error
            });
    }else{
        legoData.getAllsets()
            .then(sets=>{
                res.json(sets);
            })
            .catch(error=>{
                res.status(404).send(error);
            });
    }

});


// Invoking the function with a known setNum value from your data set.
app.get('/lego/sets/:set_num', (req, res) => {
    const setNum = req.params.set_num;

    legoData.getSetByNum(setNum)
        .then(set => {
            if (set) {
                res.json(set);
            } else {
                res.status(404).send('Lego set not found');
            }
        })
        .catch(error => {
            res.status(404).send(error);
        });
});




// // Add support for a custom "404 error".
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});




// Get start the server
app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
