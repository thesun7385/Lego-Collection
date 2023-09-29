/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Supachai Ruknuy Student ID: 121707228 Date:28-Sep-2023
*
********************************************************************************/

const express = require('express');
const app = express();
const port = 3000; // Choose a port number

const legoData = require('./modules/legoSets');

// Define an async function to start the server
async function startServer() {
  try {
    // Initialize the legoData module (wait for it to complete)
    await legoData.initialize();

    // Configure your routes here

    // GET root route
    app.get('/', (req, res) => {
      res.send('Assignment 2: Supachai Ruknuy - 121707228');
    });

    // GET all Lego sets
    app.get('/lego/sets', (req, res) => {
      legoData
        .getAllSets()
        .then(sets => {
          res.json(sets);
        })
        .catch(error => {
          res.status(500).send(error); // Handle errors appropriately
        });
    });

    // GET Lego set by set_num
    app.get('/lego/sets/num-demo', (req, res) => {
      const setNum = '001-1'; // Replace with a known setNum value

      legoData
        .getSetByNum(setNum)
        .then(set => {
          res.json(set);
        })
        .catch(error => {
          res.status(500).send(error); // Handle errors appropriately
        });
    });

    // GET Lego sets by theme
    app.get('/lego/sets/theme-demo', (req, res) => {
      const theme = 'tech'; // Replace with a known theme value (part of the theme name in lowercase)

      legoData
        .getSetsByTheme(theme)
        .then(sets => {
          res.json(sets);
        })
        .catch(error => {
          res.status(500).send(error); // Handle errors appropriately
        });
    });

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

// Call the async function to start the server
startServer();
