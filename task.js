var tos = `
Error: The TOS file for this guild is corrupted and cannot be read from
`
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
		  //name: 'ﾠ',
		  name: 'Apache 2.4.7 Linux | node-v8.11.1',
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
    if (hour == 20 && minutes == 0 && seconds == 0){
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
  if (message.content.toLowerCase() == ">tos"){
	message.reply("```yaml\n"+tos+"\n```");
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
    }}).catch(function(err){ message.reply("User not found or they have disabled direct messages."); return; });
    message.delete();
  }
  if (message.content.toLowerCase().substr(0,7) == ">accept"){
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
    var reason = cmd.substr(userId.length+12);
    message.member.guild.members.find("id", userId).send({embed:{
	    title: "Mod Application",
	    description: "Your mod application has been accepted by <@"+message.author.id+">\nCongratulations!",
	    color: 955181
    }}).catch(function(err){ message.reply("User not found or they have disabled direct messages."); return; });
    message.delete();
  }
  
  
  // Mod Applications
  if (message.channel.name == "mod-applications" && !message.author.bot){
    var msg = message;
    message.delete();
    msg.author.send({embed:{
	    title: "Mod Application",
	    description: "Your mod application is pending approval. Please do not submit another until you receive a message from Sebby or House.\n**DO NOT LEAVE HEBBY OR DISABLE DIRECT MESSAGES OR YOU WILL NOT BE ACCEPTED**",
	    color: 15051
    },files:[
    	    "https://i.imgur.com/sOT5keR.png"
    ]}).catch(console.error);
    // Message Sebby & House the application
    var embed = {embed:{
	    title: "Mod Application",
	    description: `Submitted by <@${message.author.id}>`,
	    color: 15051,
	    fields: [{
		    name: "**Application**",
		    value: "```\n"+msg.content+"\n```"
	    }, {
		    name: "**Accept / Deny**",
		    value: "Please run `>deny @"+message.author.username+"`, or `>accept @"+message.author.username+"` in Hebby"
	    }]
    }}
    client.guilds.get("395371039779192842").members.find("id", "299708692129906692").send(embed).catch(console.error);
    client.guilds.get("395371039779192842").members.find("id", "346507536389898250").send(embed).catch(console.error);
  }
  if (message.channel.name == "script-dumps" && !message.author.bot){
    var attachments = message.attachments.array();
    if (attachments.length < 1){
      message.reply("Please attach a .txt or .lua file")
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
client.on('guildMemberAdd', member => {
  member.send({embed:{
	  title: "Mod Application",
	  description: `Welcome to Hebby, I'm SSB Manager, created by Sebby#0426 for the Hebby discord.\nIf you wish to apply for a mod application, send a message in the #mod-applications channel of Hebby.\nPlease run the command ` + "`>tos`" + ` for the full Terms of Service.`,
	  color: 15051
  });
// Login
client.login(BOT_KEY);
