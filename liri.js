require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var liriCommand = process.argv[2];
var term = process.argv.slice(3).join(" ");


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

    
    default: 
        console.log(
            "\n" + "------- After writing node liri.js, type any of the following commands -------\n" + "\n" +
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


function myTweets() {
    var params = { screen_name: 'testacctcolumbi'};
    var client = new Twitter(keys.twitter);

    fs.appendFile("./log.txt", 
        "\n" + 
        "------------------------------------- My Tweets -------------------------------------" + 
        "\n", function(err) {
                    if(err) throw err;
                });
    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        console.log("\n--------------- Brian's Latest Tweets ---------------");
        if (!err) {
            for (var i = 0; i < tweets.length; i++) {
                var createdAt = tweets[i].created_at.split(" ");
                createdAt.splice(4, 1);
                var tweetData = "\nTweet " + (i+1) + ": " + "\"" + tweets[i].text + "\" " + "(Date: " + createdAt.join(" ") + ")";
                console.log(tweetData);
                fs.appendFile("./log.txt", tweetData + "\n", function(err) {
                    if (err) throw err;
                });
            }
        } else {
            console.log(err);
        };
        console.log("\n-----------------------------------------------------\n");
    });
};



function spotifyThisSong(trackName) {
    if (!trackName) {
        trackName = "Ace of Base";
    };
    var songRequest = trackName;
    fs.appendFile("./log.txt", 
        "\n" + 
        "------------------------------- Spotify Search Results -----------------------------" + 
        "\n\n", function(err) {
            if(err) throw err;
        });

    spotify.search({ type: "track", query: songRequest}, function (err, data) {
        if (!err) {
            var trackInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                console.log("\n------------- Spotify Search Result "+ (i+1) +" ---------------");
                if (trackInfo[i] !== undefined) {
                    var spotifyResults =
                        "\nArtist: " + trackInfo[i].artists[0].name + "\n" +
                        "\nSong: " + trackInfo[i].name + "\n" +
                        "\nPreview URL: " + trackInfo[i].preview_url + "\n" +
                        "\nAlbum: " + trackInfo[i].album.name + "\n";
                        console.log(spotifyResults);
                        fs.appendFile("log.txt", "********* Spotify Search Result " + (i+1) 
                            + " *********"+ "\n" + spotifyResults + "\n", function(err) {
                            if(err) throw err;
                        });
                    };
                };
            } else {
                console.log(err);
                return;
            };
        });
};


function movieThis() {
    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";
    fs.appendFile("./log.txt", 
        "\n" + 
        "--------------------------- Movie Details: " + term + " ----------------------------\n" + 
        "\n", function(err) {
            if(err) throw err;
        });

    request(queryUrl, function (err, response, body) {
        console.log("\n----------- OMDB Movie Info: " + term + " -----------\n");
        if (!err && response.statusCode === 200) {
            var myMovieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + myMovieData.Title + "\n" +
                "\nYear: " + myMovieData.Year + "\n" +
                "\nIMDB Rating: " + myMovieData.Ratings[0].Value + "\n" +
                "\nRotten Tomatoes Rating: " + myMovieData.Ratings[1].Value + "\n" +
                "\nOrigin Country: " + myMovieData.Country + "\n" +
                "\nLanguage: " + myMovieData.Language + "\n" +
                "\nPlot: " + myMovieData.Plot + "\n" +
                "\nActors: " + myMovieData.Actors + "\n";
                console.log(queryUrlResults);
                fs.appendFile("log.txt", queryUrlResults, function(err) {
                    if(err) throw err;
                });
            } else {
                console.log(err);
                return;
            };
            console.log("\n-----------------------------------------------------\n");
        });
    };


function doWhatItSays() {
    fs.appendFile("./log.txt", "\n" + 
        "------------------------------------- Do What It Says -------------------------------------" + 
        "\n", function(err) {
                    if(err) throw err;
                });
    fs.readFile("./random.txt", "utf8", function (err, data) {
        var dataArr = data.split(', ');
        if(dataArr[0] == 'spotify-this-song') {
            spotifyThisSong(dataArr[1]);
            fs.appendFile("log.txt", dataArr[1], function() {
                console.log(dataArr[1]);
            });
        } else {
            return console.log(err);
        }
    });
};