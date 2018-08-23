
//Hide keys using dotenv package
require("dotenv").config();

//Variables used for this project
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var liriReturn = process.argv[2];
// var movieName = process.argv[3];
var term = process.argv.slice(3).join(" ");
console.log(term);

//Switch statements for multiple commands
switch (liriReturn) {
	case "my-tweets":
		myTweets(); 
		break;

	case "spotify-this-song":
		spotifyThisSong(term);
		break;

	case "movie-this":
		movieThis();
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;

//User instructions
	default: 
		console.log(
			"\n" + "type any command after 'node liri.js': " + "\n" +
			"my-tweets" + "\n" +
			"spotify-this-song 'any song title' " + "\n" +
			"movie-this 'any movie title' " + "\n" +
			"do-what-it-says " + "\n" +
			"Use quotes for multiword titles!");
};

//Write logger function here, then call it inside of each switch statement


//API Call #1: "my-tweets"


function myTweets() {
	var params = { screen_name: 'testacctcolumbi'};
    var client = new Twitter(keys.twitter);
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
     // console.log(tweets);
        console.log("\n-------------- Brian's Latest Tweets --------------\n");
     if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            var createdAt = tweets[i].created_at.split(" ");
            createdAt.splice(4, 1);
            console.log(tweets[i].text, createdAt.join(" "));
            }
                } else {
        console.log(error);
		};
        console.log("\n--------------------------------------------------\n");
  });

        //create a log function and place that log function inside each of the functions
        //fs.appendfile("log.text", function (err, ) )
        //pass what I'm going to log and
};


// Spotify function

function spotifyThisSong(trackName) {
    // var trackName = process.argv[3];
    if (!trackName) {
        trackName = 'Ace of Base';
    };
    songRequest = trackName;
    spotify.search({
        type: "track",
        query: songRequest
    },
        function (err, data) {
            if (!err) {
                var trackInfo = data.tracks.items;
                for (var i = 0; i < 5; i++) {
                console.log("\n------------ Spotify Search Result "+ (i+1) +" --------------\n");
                    if (trackInfo[i] != undefined) {
                        var spotifyResults =
                            "Artist: " + trackInfo[i].artists[0].name + "\n" +
                            "Song: " + trackInfo[i].name + "\n" +
                            "Preview URL: " + trackInfo[i].preview_url + "\n" +
                            "Album: " + trackInfo[i].album.name + "\n"

                        console.log(spotifyResults);
                        console.log(' ');
                    };

                };
            } else {
                console.log("error: " + err);
                return;
          };
      });
};

//command 3 movie this
// run a request to the OMDB API with the movie specified
function movieThis() {

    //using movieName from var list at top
    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
         console.log("\n----------- OMDB Movie Info: " + term + " -----------\n");
        // If the request is successful
        if (!error && response.statusCode === 200) {

            //pull requested data in readable format
            var myMovieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + myMovieData.Title + "\n" +
                "Year: " + myMovieData.Year + "\n" +
                "IMDB Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + myMovieData.Ratings[1].Value + "\n" +
                "Origin Country: " + myMovieData.Country + "\n" +
                "Language: " + myMovieData.Language + "\n" +
                "Plot: " + myMovieData.Plot + "\n" +
                "Actors: " + myMovieData.Actors + "\n"

            console.log(queryUrlResults);
        } else {
            console.log("error: " + err);
            return;
        };
         console.log("\n--------------------------------------------------\n");
    });
};

//command 4 do-what-it-says
// This block of code creates a file called "random.txt"
// It also adds the spotify command
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        var dataArr = data.split(', ');
        // console.log(dataArr);

        // if(dataArr[1] === 'Creep') {
        //     console.log("Working");
        // } else {
        //     return console.log('error');
        // }

        if(dataArr[0] == 'spotify-this-song') {
            spotifyThisSong(dataArr[1])
        } else {
            return console.log(err);
        }

    });
};

















