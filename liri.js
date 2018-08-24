
//Hide Spotify and Twitter API keys using dotenv package
require("dotenv").config();

//Created the following global variables that will be used throughout liri.js file
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var liriReturn = process.argv[2];
var term = process.argv.slice(3).join(" ");

//Switch statements that will allow me to call
//"my-tweets" (Twitter API), "spotify-this-song"(Spotify API), "movie-this" (OMDB API), "do-what-it-says" function
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

//The following instructions are printed to the command line to show the user how to use the CLI
	default: 
		console.log(
			"\n" + "------- After writing 'node liri.js' type any of the following commands -------" + "\n" +
			"1) my-tweets" + "\n" +
			"2) spotify-this-song 'any song title' " + "\n" +
			"3) movie-this 'any movie title' " + "\n" +
			"4) do-what-it-says " + "\n" +
			 "\n*For the spotify-this-song command, no quotes are needed for the song title\n" +
			 "\n*For movie-this command, no quotes are needed for the movie title\n");
};

//Write logger function here, then call it inside of each switch statement


//API Call #1: "my-tweets"

//myTweets() is the function that will call the Twitter API and console.log my recent tweets (6)
function myTweets() {
	var params = { screen_name: 'testacctcolumbi'};

    var client = new Twitter(keys.twitter);

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
    
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


//spotifyThisSong() is the function that will call the Spotify API and console.log 5 song queries
//related to the song the user inputs

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

//movieThis() is the function that will call the OMDB API and console.log information  
//related to the movie the user inputs

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

















