const request = require('request');
var Discord = require('discord.js');
var client = new Discord.Client();
const USER_AGENT = process.env.USER_AGENT;
const BOT_KEY = process.env.BOT_KEY;
const API_KEY = process.env.API_KEY;
function doNightlyUpdate(){
  var data = undefined;
  request(API_KEY, function(error, response, body){
    var data = JSON.parse(body)
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
    var _embed = {
      title: "Nightly Update",
      color: 3394815,
      fields: _fields,
      timestamp: unix
    }
    var unix = Math.round(+new Date()/1000);
    client.guilds.get("395371039779192842").channels.find("name", "news").send({content: "@here **Nightly Update**", embed: _embed});
  });
}
client.on('ready', () => {
  ready = 1;
  var stat = 0;
  setInterval(function(){
	  client.user.setPresence({ game: { name: `Sebby's Script Builder`, type: 1 } });
  },10000)
  doNightlyUpdate();
  setInterval(doNightlyUpdate, 86400000);
})
// Login
setInterval(function()
  client.login(BOT_KEY);
}, 100000);
