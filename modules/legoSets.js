/********************************************************************************
 * WEB322 – Assignment 6
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
///////// Add dotenv
// This will allow us to access the DB_USER, DB_DATABASE
require("dotenv").config();
const Sequelize = require("sequelize");

//////////////// Set up sequelize to point to our postgres database//////
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

///////////////// Define the theme and set obejct ////////////////////
const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

///////////////// Define set /////////////////////
const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    theme_id: {
      type: Sequelize.INTEGER,
    },
    num_parts: {
      type: Sequelize.INTEGER,
    },
    img_url: {
      type: Sequelize.STRING,
    },
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

///////////// Create association between theme and set and theme
Set.belongsTo(Theme, { foreignKey: "theme_id" });

/////////////////////////////// Required Functions /////////////////////////////////////

// This function initializes sequelize and synchronizes the database
function Initialize() {
  return sequelize
    .sync()
    .then(() => {
      console.log("PGadmin DB successfully connected !!");
    })
    .catch((err) => {
      throw new Error(`Error: Unable to sync the database - ${err.message}`);
    });
}

// This function simply returns all sets from the database
function getAllsets() {
  return new Promise((resolve, reject) => {
    Set.findAll({ include: [Theme], raw: true, nest: true })
      .then((sets) => {
        resolve(sets);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// This function will return a specific "set" that matched with the setNum
function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      where: { set_num: setNum },
      raw: true,
      nest: true,
    })
      .then((sets) => {
        if (sets.length > 0) {
          // Resolve with the first element of the returned array
          resolve(sets[0]);
        } else {
          // Reject the result
          reject(`Error: Unable to find requested set with set_num: ${setNum}`);
        }
      })
      .catch((error) => {
        // Reject the result with the error
        reject(error);
      });
  });
}

// This function will return sets that match the theme from the database
function getSetsByTheme(theme) {
  return Set.findAll({
    include: [Theme],
    where: { "$Theme.name$": { [Sequelize.Op.iLike]: `%${theme}%` } },
    raw: true,
    nest: true,
  })
    .then((sets) => {
      if (sets.length > 0) {
        return sets; // Resolve with the matching result
      } else {
        throw new Error(
          `Error: Unable to find requested sets with theme: ${theme}`
        );
      }
    })
    .catch((error) => {
      throw error; // Reject the result with the error
    });
}

////////////////////////////// For assigment 5 //////////////////////////////////////

// Function to add a new set
function addSet(setData) {
  return Set.create(setData)
    .then(() => {
      // Resolve the promise if the set is created successfully
      return Promise.resolve();
    })
    .catch((err) => {
      // Reject the promise with a human-readable error message
      return Promise.reject(
        `Error: Unable to add the set - ${err.errors[0].message}`
      );
    });
}

// Function to get all themes
function getAllThemes() {
  return Theme.findAll()
    .then((themes) => {
      // Resolve the promise with the array of themes
      return Promise.resolve(themes);
    })
    .catch((err) => {
      // Reject the promise with the error message
      return Promise.reject(`Error: Unable to get themes - ${err.message}`);
    });
}

// Function to edit a set
function editSet(setNum, setData) {
  return Set.update(setData, {
    where: { set_num: setNum },
    raw: true,
    nest: true,
  })
    .then((result) => {
      if (result[0] > 0) {
        // Set was updated successfully
        return Promise.resolve();
      } else {
        // No set was updated, reject with an error message
        return Promise.reject(
          new Error(`Error: Unable to find set with set_num: ${setNum}`)
        );
      }
    })
    .catch((error) => {
      // Reject the Promise with the first error message
      return Promise.reject(new Error(error.errors[0].message));
    });
}

// Function to delete
function deleteSet(setNum) {
  return Set.destroy({
    where: { set_num: setNum },
    raw: true,
    nest: true,
  })
    .then((result) => {
      if (result > 0) {
        // Set was deleted successfully
        return Promise.resolve();
      } else {
        // No set was deleted, reject with an error message
        return Promise.reject(
          new Error(`Error: Unable to find set with set_num: ${setNum}`)
        );
      }
    })
    .catch((error) => {
      // Reject the Promise with the first error message
      return Promise.reject(new Error(error.errors[0].message));
    });
}

// Export functions as a module
module.exports = {
  Initialize,
  getAllsets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet,
};
