//Importing Modules
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const gitHub = require("github-search-repos");
const google = require("google");
const ytSearch = require("yt-search");
const Scraper = require("image-scraper");

//App Container
const app = express();

//Middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

//Route (API)

//Perform Different Operations
app.post("/webhook", (req, res) => {
  //Request Text from Dialog Flow
  let reqText = req.body.queryResult.queryText;

  //Request parameter of Github repo from Dialog Flow
  let reqPara = req.body.queryResult.parameters.repo;

  //Request parameter Google Search from Dialog Flow
  let reqSearch = req.body.queryResult.parameters.search;

  //Request parameter Youtube Search from Dialog Flow
  let reqUtubeSearch = req.body.queryResult.parameters.youtube;

  //Request parameter Britannica from Dialog Flow
  let reqBritannica = req.body.queryResult.parameters.britannica;

  //Request parameter image url from Dialog Flow for downloading image from that url
  let reqImgURL = req.body.queryResult.parameters.imgurl;

  //Request parameter movie from Dialog Flow for downloading movies from google
  let reqMovie = req.body.queryResult.parameters.movie;

  //Request parameter movie from Dialog Flow for downloading tv serial from google
  let reqSerial = req.body.queryResult.parameters.serial;

  //Request parameter mp3 from Dialog Flow for downloading mp3 musics
  let reqMP3 = req.body.queryResult.parameters.mp3;

  //Request parameter pdf from Dialog Flow for download pdf books
  let reqPDF = req.body.queryResult.parameters.pdf;

  //Request parameter pdf from Dialog Flow for download video songs
  let reqVideo = req.body.queryResult.parameters.video;

  //If User Ask
  if (
    reqText === "who are you ?" &&
    reqVideo === undefined &&
    reqPDF === undefined &&
    reqSerial === undefined &&
    reqMP3 === undefined &&
    reqMovie === undefined &&
    reqImgURL === undefined &&
    reqPara === undefined &&
    reqSearch === undefined &&
    reqUtubeSearch === undefined &&
    reqBritannica === undefined
  ) {
    return res.json({
      fulfillmentText:
        "I am whatsapp bot created by Vivek Anand Sharma. I'm created with Twilio+DialogFlow and Node Js as WebHook Server",
      source: "info"
    });
  }

  if (
    reqText === "can you perform google search ?" &&
    reqVideo === undefined &&
    reqPDF === undefined &&
    reqSerial === undefined &&
    reqMP3 === undefined &&
    reqMovie === undefined &&
    reqImgURL === undefined &&
    reqPara === undefined &&
    reqSearch === undefined &&
    reqUtubeSearch === undefined &&
    reqBritannica === undefined
  ) {
    return res.json({
      fulfillmentText: "Yes I can with command i.e google search anything",
      source: "info"
    });
  }
  if (
    reqText === "can you perform github search ?" &&
    reqVideo === undefined &&
    reqPDF === undefined &&
    reqSerial === undefined &&
    reqMP3 === undefined &&
    reqMovie === undefined &&
    reqImgURL === undefined &&
    reqPara === undefined &&
    reqSearch === undefined &&
    reqUtubeSearch === undefined &&
    reqBritannica === undefined
  ) {
    return res.json({
      fulfillmentText: "Yes I can with command i.e git search repo-name",
      source: "info"
    });
  }
  if (
    reqText === "can you perform youtube search ?" &&
    reqVideo === undefined &&
    reqPDF === undefined &&
    reqSerial === undefined &&
    reqMP3 === undefined &&
    reqMovie === undefined &&
    reqImgURL === undefined &&
    reqPara === undefined &&
    reqSearch === undefined &&
    reqUtubeSearch === undefined &&
    reqBritannica === undefined
  ) {
    return res.json({
      fulfillmentText: "Yes I can with command i.e youtube search anything",
      source: "info"
    });
  }
  if (
    reqText === "what happened on this day ?" &&
    reqVideo === undefined &&
    reqPDF === undefined &&
    reqSerial === undefined &&
    reqMP3 === undefined &&
    reqMovie === undefined &&
    reqImgURL === undefined &&
    reqPara === undefined &&
    reqSearch === undefined &&
    reqUtubeSearch === undefined &&
    reqBritannica === undefined
  ) {
    axios.get("https://www.history.com/this-day-in-history").then(response => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        let onThisDay;
        $(".m-detail--body").each(function(i, elem) {
          onThisDay = {
            theory: $(this)
              .find("p")
              .text()
              .trim()
          };
        });
        let bioIndex = onThisDay.theory.indexOf(".");
        let bioOnThisDay = onThisDay.theory.slice(0, bioIndex);
        return res.json({
          fulfillmentText: "ON THIS DAY : " + bioOnThisDay,
          source: "info"
        });
      }
    });
  }

  //Github Search Validation
  if (
    reqText !== "git search" ||
    (reqPara !== "" &&
      reqVideo === undefined &&
      reqPDF === undefined &&
      reqSerial === undefined &&
      reqMP3 === undefined &&
      reqMovie === undefined &&
      reqImgURL === undefined &&
      reqSearch === undefined &&
      reqUtubeSearch === undefined &&
      reqBritannica === undefined)
  ) {
    if (reqText.includes("git search")) {
      gitHub(reqPara).then(data => {
        return res.json({
          fulfillmentText:
            "URL : " +
            data.items[0].html_url +
            " Watchers : " +
            data.items[0].watchers,
          source: "info"
        });
      });
    }
  }

  //Google Search Validation
  if (
    reqText !== "google search" ||
    (reqSearch !== "" &&
      reqVideo === undefined &&
      reqPDF === undefined &&
      reqSerial === undefined &&
      reqMP3 === undefined &&
      reqMovie === undefined &&
      reqImgURL === undefined &&
      reqPara === undefined &&
      reqUtubeSearch === undefined &&
      reqBritannica === undefined)
  ) {
    if (reqText.includes("google search")) {
      google(reqSearch, function(err, response) {
        if (err) console.error(err);
        let link = response.links[0];
        return res.json({
          fulfillmentText:
            "Title : " +
            link.title +
            " URL : " +
            link.href +
            " Description : " +
            link.description,
          source: "info"
        });
      });
    }
  }

  //Youtube Search Validation
  if (
    reqText !== "youtube search" ||
    (reqUtubeSearch !== "" &&
      reqVideo === undefined &&
      reqPDF === undefined &&
      reqSerial === undefined &&
      reqMP3 === undefined &&
      reqMovie === undefined &&
      reqImgURL === undefined &&
      reqSearch === undefined &&
      reqPara === undefined &&
      reqBritannica === undefined)
  ) {
    if (reqText.includes("youtube search")) {
      ytSearch(reqUtubeSearch, function(err, r) {
        if (err) throw err;
        const videos = r.videos;
        const firstResult = videos[0];
        return res.json({
          fulfillmentText:
            "Title : " +
            firstResult.title +
            " URL : https://www.youtube.com" +
            firstResult.url +
            " Views : " +
            firstResult.views,
          source: "info"
        });
      });
    }
  }

  //Britannica Scrapping
  if (reqBritannica !== undefined) {
    if (
      reqText !== "do you know about" ||
      (reqBritannica !== "" &&
        reqVideo === undefined &&
        reqPDF === undefined &&
        reqSerial === undefined &&
        reqMP3 === undefined &&
        reqMovie === undefined &&
        reqImgURL === undefined &&
        reqSearch === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined)
    ) {
      let TrimmedString = reqBritannica.trim();
      let finalString = TrimmedString.replace(/ /g, "-");
      if (reqText.includes("do you know about")) {
        axios.get("https://www.britannica.com/biography/" + finalString).then(
          response => {
            if (response.status === 200) {
              const html = response.data;
              const $ = cheerio.load(html);
              let bio;
              $("#ref1").each(function(i, elem) {
                bio = {
                  author: $(this)
                    .find("p")
                    .text()
                    .trim()
                };
              });
              let bioIndex = bio.author.indexOf(".");
              let biography = bio.author.slice(0, bioIndex);
              return res.json({
                fulfillmentText: biography,
                source: "info"
              });
            }
          },
          error =>
            google(finalString, function(err, response) {
              if (err) console.error(err);
              let link = response.links[0];
              return res.json({
                fulfillmentText:
                  "Did not find anything on db here is google search result . Title : " +
                  link.title +
                  " URL : " +
                  link.href +
                  " Description : " +
                  link.description,
                source: "info"
              });
            })
        );
      }
    }
  }

  //Scrapping URL Image's
  if (reqImgURL !== undefined) {
    if (
      reqText !== "download image" ||
      (reqImgURL !== "" &&
        reqVideo === undefined &&
        reqPDF === undefined &&
        reqSerial === undefined &&
        reqMP3 === undefined &&
        reqMovie === undefined &&
        reqBritannica === undefined &&
        reqSearch === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined)
    ) {
      if (reqText.includes("download image")) {
        let scraper = new Scraper(reqImgURL);
        scraper.scrape(function(image) {
          if (image.address !== undefined) {
            return res.json({
              fulfillmentText: "You can download image here : " + image.address,
              source: "info"
            });
          }
        });
      }
    }
  }

  //Scrapping Google Search For Download Movie's
  if (reqMovie !== undefined) {
    if (
      reqText !== "download movie" ||
      (reqMovie !== "" &&
        reqVideo === undefined &&
        reqPDF === undefined &&
        reqSerial === undefined &&
        reqSearch == undefined &&
        reqMP3 === undefined &&
        reqImgURL === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined &&
        reqBritannica === undefined)
    ) {
      if (reqText.includes("download movie")) {
        google("intitle:index.of? mkv " + reqMovie, function(err, response) {
          if (err) console.error(err);
          let link = response.links[0];
          return res.json({
            fulfillmentText: "You can download this movie from : " + link.href,
            source: "info"
          });
        });
      }
    }
  }

  //Scrapping Google Search For Download TV Serial's
  if (reqSerial !== undefined) {
    if (
      reqText !== "download serial" ||
      (reqSerial !== "" &&
        reqVideo === undefined &&
        reqPDF === undefined &&
        reqMovie === undefined &&
        reqSearch == undefined &&
        reqMP3 === undefined &&
        reqImgURL === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined &&
        reqBritannica === undefined)
    ) {
      if (reqText.includes("download serial")) {
        google("intitle:index.of? mkv " + reqSerial, function(err, response) {
          if (err) console.error(err);
          let link = response.links[0];
          return res.json({
            fulfillmentText:
              "You can download this tv serial from : " + link.href,
            source: "info"
          });
        });
      }
    }
  }

  //Scrapping Google Search For Download MP3
  if (reqMP3 !== undefined) {
    if (
      reqText !== "download mp3" ||
      (reqMP3 !== "" &&
        reqVideo === undefined &&
        reqPDF === undefined &&
        reqSerial === undefined &&
        reqSearch == undefined &&
        reqMovie === undefined &&
        reqImgURL === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined &&
        reqBritannica === undefined)
    ) {
      if (reqText.includes("download mp3")) {
        google("intitle:index.of? mp3 " + reqMP3, function(err, response) {
          if (err) console.error(err);
          let link = response.links[0];
          return res.json({
            fulfillmentText: "You can download this mp3 from : " + link.href,
            source: "info"
          });
        });
      }
    }
  }

  //Scrapping Google Search For Download PDF
  if (reqPDF !== undefined) {
    if (
      reqText !== "download pdf" ||
      (reqPDF !== "" &&
        reqVideo === undefined &&
        reqMP3 === undefined &&
        reqSerial === undefined &&
        reqSearch == undefined &&
        reqMovie === undefined &&
        reqImgURL === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined &&
        reqBritannica === undefined)
    ) {
      if (reqText.includes("download pdf")) {
        google("intitle:index.of? pdf " + reqPDF, function(err, response) {
          if (err) console.error(err);
          let link = response.links[0];
          return res.json({
            fulfillmentText: "You can download this pdf from : " + link.href,
            source: "info"
          });
        });
      }
    }
  }

  //Scrapping Google Search For Download Video Song's
  if (reqVideo !== undefined) {
    if (
      reqText !== "download video" ||
      (reqVideo !== "" &&
        reqPDF === undefined &&
        reqMP3 === undefined &&
        reqSerial === undefined &&
        reqSearch == undefined &&
        reqMovie === undefined &&
        reqImgURL === undefined &&
        reqPara === undefined &&
        reqUtubeSearch === undefined &&
        reqBritannica === undefined)
    ) {
      if (reqText.includes("download video")) {
        google("intitle:index.of? mp4 " + reqVideo, function(err, response) {
          if (err) console.error(err);
          let link = response.links[0];
          return res.json({
            fulfillmentText: "You can download this video from : " + link.href,
            source: "info"
          });
        });
      }
    }
  }
});

//Server Listen Port
app.listen(process.env.PORT, err => {
  if (err) console.log("err");
  else console.log("Server is running");
});
