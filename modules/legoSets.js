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

// Read both files
const setData = require("../data/setData");
const themeData = require("../data/themeData");

// Create an empty array
let sets = [];

/////////////////// Required Functions //////////////////////

//This function is to fill the "sets" array
function Initialize()
{
    return new Promise((resolve, reject)=> {

        // Loop through each element in the setData object
    setData.forEach(set => 
        {
            // Find theme data based on theme_id
            const theme = themeData.find(theme => theme.id === set.theme_id);
            
            // Validate result, adding to the theme attribute
            if(theme)
            {
                set.theme = theme.name;
            }
    
            // Push the new element to the object
            sets.push(set);
    
        });

        // Resolve the promise with no data
        resolve();

    });    

}


// This function simply returns the complete "sets" array
function getAllsets()
{ 
    return new Promise((resolve, reject)=>{

        if(sets.length ===0)
        {
            reject("The sets array is empty. Please call initialize the array")
        }
        else
        {
             // Resolve the promise the sets
             resolve(sets);
        }

    })
}

// This function will return a specific "set" that matched with the setNum
function getSetByNum(setNum)
{
    return new Promise((resolve, reject) => {

        // Find the set_num
        const foundSetNum = sets.find(set => set.set_num == setNum);

        if(foundSetNum)
        {
            // Resolve with the mathcing result
            resolve(foundSetNum);

        }else{
            // Reject the result
            reject(`Error: Not found the set with set_num: ${setNum}`);

    }

    });
}


// This function will return a specific "set" that matched with the theme
function getSetsByTheme(theme)
{
    return new Promise((resolve, reject) => {

         // Convert to lower case
        const themeLowerCase = theme.toLowerCase();

        // Use the filter method to find sets matching the theme
        const matchedResult = sets.filter(set => 
        {
            // Convert the set to lower case 
            const setLowerCase = set.theme.toLowerCase();

            // Check the letter
            return setLowerCase.includes(themeLowerCase);

    });

        if(matchedResult.length>0)
        {
            // Resolve with the mathcing result
            resolve(matchedResult);
        }else{

            // Reject the result
            reject(`Error: Not found the set with theme: ${theme}`);

        }
  
    });
   
}

// Export functions as a module
module.exports = {Initialize, getAllsets, getSetByNum, getSetsByTheme};


// Test functions [result: OK]
 /* 
//Load all sets
Initialize();

//Get all set
const allset= getAllsets();
console.log(allset);

// get set_num
const selectNum = getSetByNum("6539-1");
console.log(selectNum);

// get theme
const selectTheme = getSetsByTheme("Technic");
console.log(selectTheme);
*/

