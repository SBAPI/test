const request = require('request');
var Discord = require('discord.js');
var client = new Discord.Client();
const USER_AGENT = process.env.USER_AGENT;
const BOT_KEY = process.env.BOT_KEY;
const API_KEY = process.env.API_KEY;
function doNightlyUpdate(skap){
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
	  client.user.setPresence({game:{
		  name: 'ﾠ',
		  type: 1,
		  url: 'https://twitch.tv/thelucyclub'
	  }});
  },10000)
  var statChannel = client.guilds.get("395371039779192842").channels.find("name", "live-stats")
  statChannel.fetchMessages({ limit: 10 })
  .then(messages => {
    for (let i = 0; i < messages.length; i++){
      messages[i].delete();
    }
    var stat = null;
    statChannel.send({embed:{
	    title: "Live Stats",
	    fields: [],
	    footer: {
		    text: "Updates every 5 seconds"
	    }
    }})
    .then(msg => {
	    msg.react("🇨");
	    setTimeout(function(){
              msg.react("🇴");
	    }, 1000);
	    setTimeout(function(){
	      msg.react("⭕");
	    }, 2000);
	    setTimeout(function(){
	      msg.react("🇱");
	    }, 3000);
	    stat = msg;
    });
    setInterval(function(){
      var date = new Date;
      var seconds = date.getSeconds();
      var minutes = date.getMinutes();
      var hour = date.getHours();
      var timeStamp = {
        tHour: hour+4,
        tMinute: minutes,
        tSeconds: seconds
      }
      request(API_KEY, function(error, response, body){
        var data = JSON.parse(body);
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
        stat.edit({embed:{
          title: "Live Stats",
          fields: _fields,
          footer: {
            text: "Last updated at "+timeStamp.tHour+":"+timeStamp.tMinute+":"+timeStamp.tSeconds+" EST"
          }
        }});
      })
    }, 5000);
  });
})
setInterval(function(){
    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    date = new Date;
    if (hour == 24 && minutes == 0 && seconds == 0){
        doNightlyUpdate();
        console.log("update");
    }
}, 1000);
client.on('message', message => {try{
  // Commands
  if (message.content.toLowerCase() == ">help"){
    message.reply(`
**Help**:
*>getscore*: (BROKEN) __Gets your all time point balance__
*>ssbinfo*: __Coming soon__
    `);
  }
  /*if (message.content.toLowerCase() == ">getscore"){
    var match = message.author.nickname.match(/\(\w+\)/)[0]
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
  }*/
  if (message.content.toLowerCase().substr(0,5) == ">deny"){
    if (message.author.id != 299708692129906692 && message.author.id != 346507536389898250){ return; }
    var cmd = message.content
    console.log(cmd)
    var match = cmd.match(/\<\@\!\w+\>/);
    if (match == null){
      match = cmd.match(/\<\@\w+\>/);
    }
    match = match[0];
    var userId = match.substr(2, match.length-3);
    if (userId.includes("!")){
      userId = match.substr(3, match.length-4);
    }
    var reason = cmd.substr(userId.length+10);
    message.member.guild.members.find("id", userId).send({embed:{
	    title: "Mod Application",
	    description: "Your mod application has been denied. Reason:\n```"+reason+"```",
	    color: 13632027
    }}).catch(function(err){ message.reply("User not found"); return; });
    message.delete();
  }
  
  // Mod Applications
  if (message.channel.name == "mod-applications" && !message.author.bot){
    var msg = message;
    message.delete();
    msg.author.send({embed:{
	    title: "Mod Application",
	    description: "Your mod application is pending approval. Please do not submit another until you receive a message from Sebby.",
	    color: 15051
    },files:[
    	    "https://cdn.discordapp.com/attachments/402320341420212224/427530290064523274/lua_hammer.png"
    ]})
    .catch(function(err){
      message.reply("You need to accept direct messages for your application to be accepted")
      .then(mesg => {
        setTimeout(function(){
		mesg.delete();
	}, 5000);
      });
    });
    client.guilds.get("395371039779192842").channels.find("name", "bot-logs").send({embed:{
	    title: "Mod Application",
	    description: `<@${message.author.id}>`,
	    color: 15051,
	    fields: [{
		    name: "**Application**",
		    value: "```\n"+msg.content+"\n```"
	    }]
    }});
  }
  if (message.channel.name == "script-dumps" && !message.author.bot){
    var attachments = message.attachments.array();
    if (attachments.length < 1){
      message.reply("No attached files")
      .then(mesg => {
        setTimeout(function(){
	    mesg.delete();
        }, 5000);
      });
      message.delete();
    }
    for (i = 0; i < attachments.length; i++) {
	var file = attachments[i].filename
	if (file.substr(file.length-4) != ".lua" && file.substr(file.length-4) != ".txt"){
	  message.reply("Uploaded file must be a `.txt` or `.lua` file.")
	  .then(mesg => {
            setTimeout(function(){
	    	mesg.delete();
	    }, 5000);
	  });
	  message.delete();
	}
    }
  }
}catch(err){console.log(err.message)}})
// Login
client.login(BOT_KEY);
