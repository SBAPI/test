var tos = `
Error: The TOS file for this guild is corrupted and cannot be read from
`
const request = require('request');
var Discord = require('discord.js');
var client = new Discord.Client();
client.on('ready', () => {
  ready = 1;
  var stat = 0;
  setInterval(function(){
	  client.user.setPresence({game:{
		  //name: 'ﾠ',
		  name: 'Fortnite',
		  type: 1
	  }});
  },10000)
});
client.on('message', message => {try{
  // Commands
  if (message.content.toLowerCase().startsWith(">play")){
    
  }
}catch(err){console.log(err.message)}})
// Login
client.login(BOT_KEY);
