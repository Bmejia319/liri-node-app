//Hide keys with dotenv package
require("dotenv").config();

//Global variables for liri.js
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);
var liriCommand = process.argv[2];
var term = process.argv.slice(3).join(" ");

//Switch statements will evaluate command and perform the functions below
switch (liriCommand) {
    case "post-tweets":
        postTweets(term);
        break;

    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThisSong(term);
        break;

    case "movie-this":
        movieThis(term);
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
        //Instructions for user on how to use liri.js
        console.log(
            "\n" +
                "------------------------------ Instructions --------------------------------\n" +
                "------------ Type any of the following commands after node liri ------------\n" +
                "\n" +
                "1) Post a new tweet to my Twitter feed: @testacctcolumbi with post-tweets." +
                "\n" +
                "  *Example: node liri post-tweets My name is Brian" +
                "\n" +
                "\n2) Pull my latest tweets with the my-tweets command." +
                "\n" +
                "  *Example: node liri my-tweets" +
                "\n" +
                "\n3) Search for any song with spotify-this-song." +
                "\n" +
                "   *Example: node liri spotify-this-song Mr. Brightside" +
                "\n" +
                "\n4) Look up details about your favorite movies with movie-this." +
                "\n" +
                "  *Example: node liri movie-this The Avengers" +
                "\n" +
                "\n5) Type do-what-it-says to see Liri perform one of the commands above." +
                "\n" +
                "  *Example: node liri do-what-it-says\n" +
                "\n----------------------------------------------------------------------------\n"
        );
}

//====================================Twitter Tweet Post================================
function postTweets(post) {
    var params = { status: post };
    var client = new Twitter(keys.twitter);

    fs.appendFile(
        "log.txt",
        "\n" +
            "------------------------------------- New Tweet -------------------------------------" +
            "\n",
        function(err) {
            if (err) throw err;
        }
    );
    client.post("statuses/update", params, function(err, tweet, response) {
        if (!err) {
            var i = 0;
            var newPost = tweet.text;
            console.log(newPost);
            fs.appendFile(
                "log.txt",
                "\n New tweet : " + '"' + newPost + '"' + "\n",
                function(err) {
                    if (err) throw err;
                }
            );
        } else {
        }
    });
}

//====================================Tweet Retrieval================================
//myTweets() calls Twitter API and prints out my most recent tweets
function myTweets() {
    //params and clietn will use API keys/screen name for authentication
    var params = { screen_name: "testacctcolumbi" };
    var client = new Twitter(keys.twitter);

    //First fs.appendFile() prints header to log.txt
    fs.appendFile(
        "./log.txt",
        "\n" +
            "------------------------------------- My Tweets -------------------------------------" +
            "\n",
        function(err) {
            if (err) throw err;
        }
    );

    //Call to Twitter API
    client.get("statuses/user_timeline", params, function(
        err,
        tweets,
        response
    ) {
        //Insert header for tweets via console.log
        console.log("\n--------------- Brian's Latest Tweets ---------------");

        //For loop cycles through tweets and prints them to the CLI
        if (!err) {
            for (var i = 0; i < tweets.length; i++) {
                //createdAt variable captures time-stamps
                //Used .split to return array of time-stamp sub-strings
                var createdAt = tweets[i].created_at.split(" ");

                //Used .splice to remove "+0000" from array of time-stamps
                createdAt.splice(4, 1);

                //tweetData variable captures formatted tweets that will be printed to CLI
                var tweetData =
                    "\n New tweet " +
                    (i + 1) +
                    ": " +
                    '"' +
                    tweets[i].text +
                    '" ' +
                    "(Date: " +
                    createdAt.join(" ") +
                    ")";

                //Prints tweets to CLI
                console.log(tweetData);

                //The second fs.appendFile stores the tweets printed in the CLI in log.txt
                fs.appendFile("./log.txt", tweetData + "\n", function(err) {
                    if (err) throw err;
                });
            }
        } else {
            console.log(err);
        }
        //Prints line to close Brian's Latest Tweets section
        console.log(
            "\n-----------------------------------------------------\n"
        );
    });
}

//====================================Spotify Search Results================================
//spotifyThisSong() searches information about the song the user inputs
//term variable used in switch statment (line: 22) becomes trackName
function spotifyThisSong(trackName) {
    //If there is no value after spotify-this-song, trackName is assigned to "The Sign" by Ace of Base
    //trackName is then passed through spotifyThisSong() below
    if (!trackName) {
        trackName = "Ace of Base";
    }
    //songRequest variable qill be used for Spotify API call
    var songRequest = trackName;

    //First fs.appendFile() prints header to log.txt
    fs.appendFile(
        "./log.txt",
        "\n" +
            "------------------------------- Spotify Search Results -----------------------------" +
            "\n\n",
        function(err) {
            if (err) throw err;
        }
    );

    //Call to Spotify API
    spotify.search({ type: "track", query: songRequest }, function(err, data) {
        if (!err) {
            var trackInfo = data.tracks.items;

            //For loop cycles through object and prints specific song properties to the CLI
            for (var i = 0; i < 10; i++) {
                console.log(
                    "\n------------- Spotify Search Results " +
                        (i + 1) +
                        " ---------------"
                );
                if (trackInfo[i] !== undefined) {
                    //spotifyResults variable song data
                    var spotifyResults =
                        "\nArtist: " +
                        trackInfo[i].artists[0].name +
                        "\n" +
                        "\nSong: " +
                        trackInfo[i].name +
                        "\n" +
                        "\nPreview URL: " +
                        trackInfo[i].preview_url +
                        "\n" +
                        "\nAlbum: " +
                        trackInfo[i].album.name +
                        "\n";

                    //Prints song data
                    console.log(spotifyResults);

                    //The second fs.appendFile() stores the song data in log.txt
                    fs.appendFile(
                        "log.txt",
                        "********* Spotify Search Result " +
                            (i + 1) +
                            " *********" +
                            "\n" +
                            spotifyResults +
                            "\n",
                        function(err) {
                            if (err) throw err;
                        }
                    );
                }
            }
        } else {
            console.log(err);
            return;
        }
    });
}

//===================================OMDB Search Results================================
//movieThis() searches for/prints data on a movie the user inputs
function movieThis(input) {
    if (!input) {
        input = "Mr. Nobody";
    }
    var film = input;
    var queryUrl =
        "http://www.omdbapi.com/?t=" + film + "&y=&plot=short&apikey=trilogy";

    //First fs.appendFile() prints header to log.txt
    fs.appendFile(
        "./log.txt",
        "\n" +
            "--------------------------- Movie Details: " +
            term +
            " ----------------------------\n" +
            "\n",
        function(err) {
            if (err) throw err;
        }
    );
    //Call to OMDB API
    request(queryUrl, function(err, response, body) {
        console.log(
            "\n----------- OMDB Movie Info: " + film + " -----------\n"
        );
        if (!err && response.statusCode === 200) {
            //Parses JSON file into readable text
            var myMovieData = JSON.parse(body);

            //queryUrlResults variable captures movie data
            var queryUrlResults =
                "Title: " +
                myMovieData.Title +
                "\n" +
                "\nYear: " +
                myMovieData.Year +
                "\n" +
                "\nIMDB Rating: " +
                myMovieData.Ratings[0].Value +
                "\n" +
                "\nRotten Tomatoes Rating: " +
                myMovieData.Ratings[1].Value +
                "\n" +
                "\nOrigin Country: " +
                myMovieData.Country +
                "\n" +
                "\nLanguage: " +
                myMovieData.Language +
                "\n" +
                "\nPlot: " +
                myMovieData.Plot +
                "\n" +
                "\nActors: " +
                myMovieData.Actors +
                "\n";
            //Prints movie data
            console.log(queryUrlResults);

            //The second fs.appendFile() stores the movie data in log.txt
            fs.appendFile("log.txt", queryUrlResults, function(err) {
                if (err) throw err;
            });
        } else {
            console.log(err);
            return;
        }
        //Prints line to close Brian's Latest Tweets section
        console.log(
            "\n-----------------------------------------------------\n"
        );
    });
}

//==================================Random Command Do-What-It-Says================================
//doWhatItSays() reads data in random.txt file and performs spotify-this-song command
function doWhatItSays() {
    //First fs.appendFile() prints header to log.txt
    fs.appendFile(
        "./log.txt",
        "\n" +
            "---------------------------------- Do What It Says ---------------------------------" +
            "\n",
        function(err) {
            if (err) throw err;
        }
    );
    fs.readFile("./random.txt", "utf8", function(err, data) {
        var dataArr = data.split(", ");
        if (dataArr[0] == "spotify-this-song") {
            var rand = spotifyThisSong(dataArr[1]);
            //The second fs.appendFile() stores the results in log.txt
            fs.appendFile("log.txt", rand, function(err) {
                if (err) throw err;
            });
        } else {
            return console.log(err);
        }
    });
}