const request = require('request');
const USER_AGENT = process.env.USER_AGENT;
const WEBHOOK_KEY = process.env.WEBHOOK_KEY;
const API_KEY = process.env.API_KEY;
function doNightlyUpdate(){
  var data = undefined;
  request(API_KEY, function(error, response, body){
    data = JSON.parse(body);
  });
  if (!data){
    console.warn("Can not fetch data");
    return;
  }
  var _fields = [
    {
      name: "⭐ Favorites",
      value: data.FavoritedCount,
      inline: true
    },
    {
      name: "👍 Likes",
      value: data.TotalUpVotes,
      inline: true
    },
    {
      name: "👎 Dislikes",
      value: data.TotalDownVotes,
      inline: true
    },
    {
      name: "👁️ Plays",
      value: data.VisitedCount,
      inline: true
    },
    {
      name: "👨 Online",
      value: data.OnlineCount,
      inline: true
    },
    {
      name: "⬆️ Last Updated",
      value: data.Updated,
      inline: true
    }
  ]
  var unix = Math.round(+new Date()/1000);
  request.post('http://service.com/upload', {
    form: {
      embeds:{{
        title: "Nightly Update",
        color: 3394815,
        fields: _fields,
        timestamp: unix
      }}
    }
  })
}
doNightlyUpdate();
setInterval(doNightlyUpdate, 86400000);
