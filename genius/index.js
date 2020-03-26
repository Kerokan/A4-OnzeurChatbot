'use strict'

const request = require('request');
const conf = require('../config');
const apiKey = conf.Genius.ClientAccessToken;

const extractEntity = (nlp, entity) =>{
    let result = null;
    let array = Object.entries(nlp.entities);
    array.forEach((item) => {
      if(item[0] === entity){
        item[1].forEach((tempEnti) => {
          if(tempEnti.confidence > 0.5){
            result = tempEnti.value
          }
        });
      }
    });
    return result
}

const getSocialNetwork = (artist) => {
  return new Promise((resolve, reject) => {
    var artistURI = encodeURI(artist);
    request('https://api.genius.com/search?q=' + artistURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var artist_path = body.response.hits[0].result.primary_artist.api_path;
      request('https://api.genius.com' + artist_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);
        var facebook = "not specified",
            twitter = "not specified",
            instagram = "not specified";
        if(typeof body2.response.artist.facebook_name  === 'undefined'){
        } else {
          facebook = body2.response.artist.facebook_name;
        }
        if(typeof body2.response.artist.twitter_name  === 'undefined'){
        } else {
          twitter = body2.response.artist.twitter_name;
        }
        if(typeof body2.response.artist.instagram_name  === 'undefined'){
        } else {
          instagram = body2.response.artist.instagram_name;
        }
        resolve("The Social Network of " + body2.response.artist.name + " are :\n\t- Facebook : " + facebook + "\n\t- Twitter : " + twitter + "\n\t- Instagram : " + instagram);
      });
    });
  });
}

const getMusicList = (artist) => {
  return new Promise((resolve, reject) => {
    var artistURI = encodeURI(artist);
    request('https://api.genius.com/search?q=' + artistURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var x = 0;
      var music = "";
      while(body.response.hits[x] && x < 1000){
        music = music + "\n\t- " + body.response.hits[x].result.title;
        x = x + 1;
      }


      var result = "The top " + x +" songs " + artist + " sings in are: " + music;
      resolve(result);
    });
  });
}

const getAltNames = (artist) => {
  return new Promise((resolve, reject) => {
    var artistURI = encodeURI(artist);
    request('https://api.genius.com/search?q=' + artistURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var artist_path = body.response.hits[0].result.primary_artist.api_path;
      request('https://api.genius.com' + artist_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);

        var x = 0;
        var names = "";

        while(body2.response.artist.alternate_names[x] && x < 1000){
          names = names + "\n\t- " + body2.response.artist.alternate_names[x];
          x = x + 1;
        }

        resolve("The alternate names of " + body2.response.artist.name + " are : " + names);
      });
    });
  });
}

const getDescription = (artist) => {
  return new Promise((resolve, reject) => {
    var artistURI = encodeURI(artist);
    request('https://api.genius.com/search?q=' + artistURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var artist_path = body.response.hits[0].result.primary_artist.api_path;
      request('https://api.genius.com' + artist_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);

        var x = 0;
        var desc = "";

        while(body2.response.artist.description.dom.children[0].children[x] && x < 1000){
          if(typeof body2.response.artist.description.dom.children[0].children[x].children === 'undefined'){
            desc = desc + body2.response.artist.description.dom.children[0].children[x];
          } else {
            desc = desc + body2.response.artist.description.dom.children[0].children[x].children[0];
          }
          x = x + 1;
        }

        resolve(desc);
      });
    });
  });
}

const getLyrics = (song) => {
  return new Promise((resolve, reject) => {
    var songURI = encodeURI(song);
    request('https://api.genius.com/search?q=' + songURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var song_path = body.response.hits[0].result.api_path;
      request('https://api.genius.com' + song_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);
        resolve("Here are the lyrics of " + body2.response.song.full_title + " : " + body2.response.song.url);
      });
    });
  });
}

const getListenTo = (song) => {
  return new Promise((resolve, reject) => {
    var songURI = encodeURI(song);
    request('https://api.genius.com/search?q=' + songURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var song_path = body.response.hits[0].result.api_path;
      request('https://api.genius.com' + song_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);

        var player_url = body2.response.song.apple_music_player_url;
        var txt = "Here is an extract of ";

        var x = 0;
        while(body2.response.song.media[x] && x < 1000){
          if(body2.response.song.media[x].provider == 'youtube'){
            player_url = body2.response.song.media[x].url;
            txt = "Here is the youtube link of ";
            x = 1000;
          }
          x = x+1;
        }

        resolve(txt + body2.response.song.full_title + " : " + player_url);
      });
    });
  });
}

const getAlbumOfMusic = (song) => {
  return new Promise((resolve, reject) => {
    var songURI = encodeURI(song);
    request('https://api.genius.com/search?q=' + songURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var song_path = body.response.hits[0].result.api_path;
      request('https://api.genius.com' + song_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);
        resolve("The song " + body2.response.song.title + " come from the album " + body2.response.song.album.full_title);
      });
    });
  });
}

const getWhoSing = (song) => {
  return new Promise((resolve, reject) => {
    var songURI = encodeURI(song);
    request('https://api.genius.com/search?q=' + songURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var song_path = body.response.hits[0].result.api_path;
      request('https://api.genius.com' + song_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);
        resolve("The main singer / group of " + body2.response.song.title + " is " + body2.response.song.primary_artist.name);
      });
    });
  });
}

const getWhoProduce = (song) => {
  return new Promise((resolve, reject) => {
    var songURI = encodeURI(song);
    request('https://api.genius.com/search?q=' + songURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var song_path = body.response.hits[0].result.api_path;
      request('https://api.genius.com' + song_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);

        var x = 0;
        var producers = "";

        while(body2.response.song.producer_artists[x] && x < 1000){
          producers = producers + "\n\t- " + body2.response.song.producer_artists[x].name;
          x = x + 1;
        }

        resolve("The producers of " + body2.response.song.full_title + " are : " + producers);
      });
    });
  });
}

const getReleaseDate = (song) => {
  return new Promise((resolve, reject) => {
    var songURI = encodeURI(song);
    request('https://api.genius.com/search?q=' + songURI + '&access_token=' + apiKey,
    (error, response, body) => {
      body = JSON.parse(body);
      var song_path = body.response.hits[0].result.api_path;
      request('https://api.genius.com' + song_path + '?access_token=' + apiKey,
      (error2, response2, body2) => {
        body2 = JSON.parse(body2);
        resolve("The song " + body2.response.song.full_title + " was released on " + body2.response.song.release_date_for_display);
      });
    });
  });
}

module.exports = nlpData => {
  return new Promise(async function(resolve, reject) {
    let intent = extractEntity(nlpData, 'intent');

    if(intent) {
      let song = extractEntity(nlpData, 'song');
      let artist = extractEntity(nlpData, 'artist');
      if(intent == 'SocialNetwork'){
        let response = await getSocialNetwork(artist);
        resolve(response);
      }
      if(intent == 'MusicList'){
        let response = await getMusicList(artist);
        resolve(response);
      }
      if(intent == 'altNames'){
        let response = await getAltNames(artist);
        resolve(response);
      }
      if(intent == 'Description'){
        let response = await getDescription(artist);
        resolve(response);
      }
      if(intent == 'Lyrics'){
        let response = await getLyrics(song);
        resolve(response);
      }
      if(intent == 'ListenTo'){
        let response = await getListenTo(song);
        resolve(response);
      }
      if(intent == 'AlbumOfMusic'){
        let response = await getAlbumOfMusic(song);
        resolve(response);
      }
      if(intent == 'WhoSing'){
        let response = await getWhoSing(song);
        resolve(response);
      }
      if(intent == 'WhoProduce'){
        let response = await getWhoProduce(song);
        resolve(response);
      }
      if(intent == 'ReleaseDate'){
        let response = await getReleaseDate(song);
        resolve(response);
      }
      if(intent == 'WantToSing'){
        let response = await getListenTo(song);
        let response2 = await getLyrics(song);
        resolve(response + "\n" + response2 + "\n Have fun while singing :)");
      }

    } else {
      resolve({
        txt: "I'm not sure I understand you!"
      });
    }
  });
}
