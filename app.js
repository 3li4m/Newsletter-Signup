const express = require("express");
const { json } = require("express/lib/response");
const app = express();
const https = require("https");
const { url } = require("inspector");

const port = 3000;


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


app.listen(port, function(){
    console.log("Server running on port "+ port);
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const email = req.body.emailInput;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                mergeFields:{
                    FNAME: firstName,
                    LNAME: lastName 
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    // Replace the X with your api key && Append your_mailChimpId to the end of the string eg /lists/myID
    var url = "https://usX.api.mailchimp.com/3.0/lists"; 

    const options = {
        method: "POST",
        auth: "yourUserName:yourAPIKey in addition make sure you api end key matches your region the first section of \
                    your url before the .api eg 'yourKey-us4'"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.send(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        // check any data that has been sent back from mailchimp
        response.on("data", function(data){
            // log the data using Json.parse to pass it 
            console.log(JSON.parse(data));
        });

        request.write(jsonData);
        request.end();
    });
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

//API Key
// Mail chimp {}

//List Id
//{} 

