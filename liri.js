
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
var liriCommand = process.argv[2];
var term = process.argv.slice(3).join(" ");

/*Switch statements that will allow the user to call "my-tweets" (Twitter API), "spotify-this-song"(Spotify API), 
"movie-this" (OMDB API), "do-what-it-says" function*/
switch (liriCommand) {
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
			"\n" + "------- After writing node liri.js, type any of the following commands -------" + "\n" +
			"1) my-tweets" + "\n" +
             "  *This will pull my latest tweets!" + "\n" +
			"\n2) spotify-this-song + 'any song title' " + "\n" +
            "   *Example: spotify-this-song Thriller" + "\n" +
			"\n3) movie-this + 'any movie title'" + "\n" +
             "  *Example: movie-this The Avengers" + "\n" +
			"\n4) do-what-it-says" + "\n" +
             "  *This will perform a random function!\n" + 
             "\n------------------------------------------------------------------------------\n");
};

//Write logger function here, then call it inside of each switch statement


/*Command #1: "my-tweets"
myTweets() is the function that will call the Twitter API and console.log my recent tweets (6)*/
function myTweets() {
    
    /*"params" variable holds screen name property for authentication. 
    Params will be thrown in as an argument into the API call ("client.get")*/
	var params = { screen_name: 'testacctcolumbi'};

    //"client" variable holds API keys from keys.js file
    var client = new Twitter(keys.twitter);

    //Calling Twitter API
	client.get('statuses/user_timeline', params, function(err, tweets, response) {
    
    //Inserted line via console.log
    console.log("\n-------------- Brian's Latest Tweets --------------\n");
     
     //For loop used to pull and print tweets and tweet time-stamps ("createdAt")
     if (!err) {
        for (var i = 0; i < tweets.length; i++) {

            /*Captured tweet time stamps in "createdaAt" variable. 
            Used .split method to get an array of time-stamp sub-strings*/
            var createdAt = tweets[i].created_at.split(" ");

            /*Used .splice method to remove "+0000" from the time-stamp array*/
            createdAt.splice(4, 1);

            /*Captured formatted tweets in variable finalTweets*/
            console.log("\nTweet " + (i+1) + ": " + "\"" + tweets[i].text + "\" " + "(Date: " + createdAt.join(" ") + ")");
            }
                } else {
        console.log(error);
		};
        console.log("\n--------------------------------------------------\n");
    });
};


/*Command #2: "spotify-this-song"
spotifyThisSong() is the function that will call the Spotify API and prints 5 song queries related to the song given*/
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

/*Command #3: "movie-this"
movieThis() is the function that will call the OMDB API and console.log details  related to the movie the user inputs*/
function movieThis() {

    /*"term" variable captures full movie title (process.argv[3])
    Once term is set up, inserted it into "queryUrl" variable for OMDB API call*/ 
    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";

    //Call being made to the OMDB API
    request(queryUrl, function (err, response, body) {
         console.log("\n----------- OMDB Movie Info: " + term + " -----------\n");
        // If the request is successful
        if (!err && response.statusCode === 200) {

            //Parse JSON data into readable format for user
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
            console.log(err);
            return;
        };
         console.log("\n--------------------------------------------------\n");
    });
};

/*Command #4: do-what-it-says
doWhatItSays reads a song "I Want It That Way" from a file called "random.txt."
Then, it performs the spotify-this-song with "I Want It That Way*/
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        var dataArr = data.split(', ');

        if(dataArr[0] == 'spotify-this-song') {
            spotifyThisSong(dataArr[1])
        } else {
            return console.log(err);
        }

    });
};

















