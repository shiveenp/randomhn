const https = require("https");
const hnApi = require("hacker-news-api");
const got = require("got");
const { Random } = require('random-js');

const random = new Random();

exports.handler = async (event) => {
    const link = await getRandomHnArticleLink();
    return link;
};

const getRandomHnArticleLink = async () => {
  let topId = "";
  const response = await got(
    "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty"
  );
  topId = response.body;
  const randomValue = random.integer(1,topId)
  console.log(randomValue);
  const link = 'https://news.ycombinator.com/item?id=' + randomValue
  return link;
};
