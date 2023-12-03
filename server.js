/********************************************************************************
 * WEB322 – Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Supachai Ruknuy Student ID: 121707228 Date: 30-Nov-2023
 *
 * Published URL: https://energetic-sun-hat-fawn.cyclic.app/
 *
 ********************************************************************************/

// Set up express server
const legoData = require("./modules/legoSets");
// Import the 'auth-service.js' module
const authData = require("./modules/auth-service");
// Import the 'client-sessions' module
const clientSessions = require("client-sessions");
const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

// Middleware Configuration
app.use(express.urlencoded({ extended: true }));

// Initialize client-sessions
app.use(
  clientSessions({
    cookieName: "session",
    secret: "o6LjQ5EVNC28ZgK64hDELM18ScpFQr", // Change this to a strong and unique secret
    duration: 24 * 60 * 60 * 1000, // Session duration in milliseconds (1 day)
    activeDuration: 5 * 60 * 1000, // Session extension duration on activity in milliseconds (5 minutes)
  })
);

// Set static folder aznd // User ejs template
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Initialize lego sets
// legoData.Initialize();
// authData.initialize();
// Initialize lego sets

// Clinet session middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Helper function to check if the user is logged in
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// GET route to render the login view
app.get("/login", (req, res) => {
  res.render("login", (errorMessage = ""));
});

// POST route to handle user login
app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");

  authData
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect("/lego/sets"); // Redirect to the /lego/sets route after successful login
    })
    .catch((err) => {
      res.render("login", { errorMessage: err, userName: req.body.userName });
    });
});

// Route to homepage.ejs - OK
app.get("/", (req, res) => {
  res.render("home");
});

// Update route for about.ejs - OK
app.get("/about", (req, res) => {
  res.render("about");
});

// Update route for sets.ejs
app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme; // query parameter

  if (theme) {
    legoData
      .getSetsByTheme(theme)
      .then((legoSets) => {
        // Render the 'sets.ejs' template with the 'legoSets' data
        res.render("sets", { sets: legoSets });
      })
      .catch((error) => {
        // Handle any other errors that may occur during data retrieval
        res.status(404).render("404", {
          message: "I'm sorry, we're unable to find what you're looking for",
        });
      });
  } else {
    legoData
      .getAllsets()
      .then((legoSets) => {
        // Render the 'sets.ejs' template with the 'legoSets' data
        res.render("sets", { sets: legoSets });
        //console.log(legoSets); // see the all collections
      })
      .catch((error) => {
        // Handle any other errors that may occur during data retrieval
        res.status(404).render("404", {
          message: "I'm sorry, we're unable to find what you're looking for",
        });
      });
  }
});

// Invoking the function with a known setNum value from your data set.
app.get("/lego/sets/:set_num", (req, res) => {
  const setNum = req.params.set_num;

  legoData
    .getSetByNum(setNum)
    .then((legoSet) => {
      if (legoSet) {
        res.render("set", { set: legoSet });
      } else {
        res.status(404).render("404", {
          message: "I'm sorry, we're unable to find what you're looking for",
        });
      }
    })
    .catch((error) => {
      // Handle any other errors that may occur during data retrieval
      res.status(404).render("404", {
        message: "I'm sorry, we're unable to find what you're looking for",
      });
    });
});

///////////////////////////// Routes for Assignment 5  ///////////////////////////////////

// Route to get the addSet.ejs view with themes
app.get("/lego/addSet", ensureLogin, (req, res) => {
  legoData
    .getAllThemes()
    .then((themes) => {
      res.render("addSet", { themes: themes });
    })
    .catch((error) => {
      res.status(500).render("500", {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    });
});

// Route to post the form submission for adding a new Lego Set
app.post(
  "/lego/addSet",
  ensureLogin,
  express.urlencoded({ extended: true }),
  (req, res) => {
    const setData = {
      name: req.body.name,
      year: parseInt(req.body.year),
      num_parts: parseInt(req.body.num_parts),
      img_url: req.body.img_url,
      theme_id: parseInt(req.body.theme_id),
      set_num: req.body.set_num,
    };

    legoData
      .addSet(setData)
      .then(() => {
        // Redirect to the /lego/sets route after successful addition
        res.redirect("/lego/sets");
      })
      .catch((error) => {
        res.status(500).render("500", {
          message: `I'm sorry, but we have encountered the following error: ${error}`,
        });
      });
  }
);

// Route to get editSet.ejs
app.get("/lego/editSet/:num", ensureLogin, (req, res) => {
  const setNum = req.params.num;

  Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
    .then(([set, themes]) => {
      // Render the 'editSet.ejs' template with the 'set', 'themes', and 'theme_id' data
      res.render("editSet", { set, themes, theme_id: set.theme_id });
    })
    .catch((error) => {
      // Handle any errors that may occur during data retrieval
      res.status(404).render("404", {
        message: `I'm sorry, we're unable to find what you're looking for: ${error}`,
      });
    });
});

// Route to post editSet.ejs
app.post("/lego/editSet", ensureLogin, (req, res) => {
  const setNum = req.body.set_num;

  legoData
    .editSet(setNum, req.body)
    .then(() => {
      // Redirect the user to the "/lego/sets" route on success
      res.redirect("/lego/sets");
    })
    .catch((error) => {
      // Render the "500" view with an appropriate error message on failure
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    });
});

// Route to delete
app.get("/lego/deleteSet/:num", ensureLogin, (req, res) => {
  const setNum = req.params.num;

  legoData
    .deleteSet(setNum)
    .then(() => {
      // Redirect the user to the "/lego/sets" route on successful deletion
      res.redirect("/lego/sets");
    })
    .catch((error) => {
      // Render the "500" view with an appropriate error message on failure
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    });
});

///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////// Routes for Assignment 6  ///////////////////////////////

// GET route to render the register view
app.get("/register", (req, res) => {
  res.render("register", { errorMessage: "", successMessage: "" });
});

// POST route to handle user registration
app.post("/register", (req, res) => {
  const userData = req.body;

  authData
    .registerUser(userData)
    .then(() => {
      res.render("register", {
        successMessage: "User created",
        errorMessage: "",
      });
    })
    .catch((err) => {
      res.render("register", {
        errorMessage: err,
        successMessage: "",
        userName: req.body.userName,
      });
    });
});

// GET route to handle user logout
app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

// GET route to render the userHistory view
app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory");
});

///////////////////////////////////////////////////////////////////////////////////////

// For a custom 404.js to handle error
app.use((req, res) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});

// // Get start the server
// app.listen(HTTP_PORT, () => {
//   console.log(`server listening on: ${HTTP_PORT}`);
// });
legoData
  .Initialize()
  .then(authData.initialize)
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log(`app listening on: ${HTTP_PORT}`);
    });
  })
  .catch(function (err) {
    console.log(`unable to start server: ${err}`);
  });
