const got = require("got");
const { Random } = require("random-js");

const random = new Random();
const maxfirstHitNotStoryIterations = 10;

exports.handler = async (event) => {
  const link = await getRandomHnArticleLink();
  console.log(link);
  const response = {
    statusCode: 302,
    headers: {
      Location: link,
    },
  };
  return response;
};

const getRandomHnArticleLink = async () => {
  let topId = '';
  let randomItemId = '';
  let hits = 0;
  const response = await got(
    "https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty"
  );
  const topStoriesResponse = await got (
    'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
  );
  topId = response.body;
  while(true) {
    console.log(hits);
    randomItemId = random.integer(1, topId);
    console.log(randomItemId);
    const itemResponse = await getItemMetadata(randomItemId);
    console.log(itemResponse);
    if(itemResponse.type === 'story' || itemResponse.type === 'poll') {
      break;
    };
    if (hits > maxfirstHitNotStoryIterations) {
      let topStoriesArray = JSON.parse(topStoriesResponse.body); 
      const randomItemIndex = random.integer(1, topStoriesArray.length-1);
      randomItemId = topStoriesArray[randomItemIndex];
      break;
    }
    hits++;
  }
  const link = "https://news.ycombinator.com/item?id=" + randomItemId;
  return link;
};

const getItemMetadata = async (id) => {
  const itemResponse = await got(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
  );
  return JSON.parse(itemResponse.body);
};