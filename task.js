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
	  client.user.setPresence({ game: { name: `>help`, type: 2 } });
  },10000)
  doNightlyUpdate();
  setInterval(doNightlyUpdate, 86400000);
})
client.on('message', message => {try{
  if (message.content.toLowerCase() == ">help"){
    message.reply(`
**Help**:
*>getscore*: __Gets your all time point balance__
    `);
  }
  if (message.content.toLowerCase() == ">getscore"){
    var match = message.channel.server.detailsOf(message.author).nick.match(/\(\w+\)/)[0]
    var user = match.substr(1, match.length-2)
    if (!user){
      message.reply("You must be verifyed to use this command. Say `!verify` in <#402320341654962176> to use this command.");
      return;
    }
    var userId = undefined;
    request("http://api.roblox.com//users/get-by-username?username="+user, function(error, response, body){
      userId = JSON.parse(body).Id;
    })
    request("https://points.roblox.com/v1/universes/556272591/users/"+userId+"/all-time", function(error, response, body){
      message.reply("Your all time points: `"+JSON.parse(body).allTimeScore+"`");
    })
  }
}catch(err){console.log(err.message)}})
// Login
client.login(BOT_KEY);
setInterval(function(){
  client.login(BOT_KEY);
}, 100000);
