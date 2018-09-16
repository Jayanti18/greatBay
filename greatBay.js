var mysql = require("mysql");
var inquirer = require('inquirer');

// Connection to mysql database 
// function conectDatabase() {
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "greatBayDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});
// }

// Create User prompts
function start() {
  inquirer.prompt([
    {
      type: "list",
      name: "userChoice",
      message: "Would you like to [POST] an auction or [BID] on an auction?",
      choices: ["1. Post", "2. Bid"]
      // message: "Answer: "
    }

    // {
    //   type: "input",
    //   name: "userChoice",
    //   message: "Answer: "
    // }

  ]).then(function (user) {
    console.log(user.userChoice);
    if (user.userChoice === '1. Post') {
      postItem();
    } else {
      bidItem();
    }
    // connection.end();
  });

};

// creating function for POST for item.
function postItem() {
  inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "What is the item you would like to submit?"
    },
    {
      type: "input",
      name: "category",
      message: "What category would you like to place your auction in?"
    },
    {
      type: "input",
      name: "startingBid",
      message: "What would you like your starting bid to be?"
    }
  ]).then(function (user) {
    console.log("Inserting a new product...\n");

    var query = connection.query(
      "INSERT INTO auctions SET ?",
      {
        item_name: user.itemName,
        category: user.category,
        starting_bid: user.startingBid,
        highest_bid: user.startingBid 
      },
      function (err, res) {
        console.log(res.affectedRows + " product inserted!\n");
      }
    );
    // console.log(query.sql);
  });
};

// ***********************
// creating function for BID for item.
function bidItem() {
  

  inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "What auction would you like to place a Bid in?"
    },

    {
      type: "input",
      name: "highestBid",
      message: "How much would you like to Bid?"
    }
  ]).then(function (user) {
    
    console.log("itemName enter by User: " + user.itemName);

    var bidItem = user.itemName;
    var sql = "SELECT item_name, highest_bid FROM auctions WHERE item_name = ?";
    connection.query(sql, [bidItem], function (err, resp) {
      if (err) throw err;
    //   console.log(resp);  
      if (user.highestBid >= resp[0].highest_bid) {
        var query = connection.query(
          "UPDATE auctions SET ? WHERE ?",
          [
          {
            highest_bid: user.highestBid
          },
          {
            item_name: user.itemName
          }
        ],
          function (err, res) {
            if (err) throw err;
            console.log("Your Bid has been updated successfully!\n");
          }
        )
      } else {
        console.log("Sorry! your bid is too low.\n");
      }
    });
  });
};
