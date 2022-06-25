const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailChimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailChimp.setConfig({
  apiKey: "de97333b3e334f1c66c06072081bd8fe-us13",
  server: "us13",
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => {
    try {
      const response = await mailChimp.lists.addListMember("5489165ef8", {
        status: "subscribed",
        email_address: subscribingUser.email,
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

// App Key
// 5585724c1de7b9e487ca68a1d473ffbe-us13

// List ID
// 5489165ef8
