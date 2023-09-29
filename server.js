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

const legoData = require("./modules/legoSets");

const express = require('express');
const app = express();
const port = 3000;

legoData.Initialize();

// This route simply sends back the text
app.get('/',(reg, res)=>{
    res.send('Assignment 2: Supachai Ruknuy - 121707228');
});

// This route is responsible for responding with all of the Lego sets
app.get('/lego/sets',(reg,res) => {

    //get allsets 
    legoData.getAllsets().then(sets=>{
        res.json(sets);
    }).catch(error=>{
        res.status(500).send(error); // catch teh errors
    });

});


// Invoking the function with a known setNum value from your data set.
app.get('/lego/sets/num-demo',(reg,res)=>{

    const setNum = '001-1'; // input value

    legoData.getSetByNum(setNum).then(sets=> {

        res.json(sets);

    }).catch(error=>{

        res.status(500).send(error); // catch the errors
    });

});


// Invoking the function with a known theme value from your data set
app.get('/lego/sets/theme-demo',(reg,res)=>{

    const theme = 'tech'; // replace with a known theme value

    legoData.getSetsByTheme(theme).then(sets=> {
        res.json(sets);
    }).catch(error=> {
        res.status(500).send(error); // catch the errors
    });

});

// Deliver to the Express server
app.listen(port,() => {

    console.log(`The server is running port ${port}`);

});