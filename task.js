var tos = `
Error: The TOS file for this guild is corrupted and cannot be read from
`
const request = require('request');
var Discord = require('discord.js');
var client = new Discord.Client();
var playlist = [];
function youtubeSearchEngine(query){
    return new Promise(function(fulfill, reject){
        request("https://www.youtube.com/results?search_query=" + encodeURIComponent(query), function(e, r, b){
            var $ = cheerio.load(b);
            var _results = $('img[data-ytimg="1"]').slice(9, 14);
            var results = $('img[data-ytimg="1"]').toArray().slice(9, 14);
            var names = $('a[class="ytd-video-renderer"]');
            var end = [];
            var __results = [];
            _results.each(function(i, elem) {
              __results[i] = $(this);
            });
            for(i = 0; i < results.length; i++){
                var r = results[i];
                var link = "https://youtube.com" + r.parent.parent.parent.attribs.href;
                var thumb = r.attribs.src//.match(/https:\/\/i.ytimg.com\/vi\/\w+\/\w+.\w+/gi)[0];
                var _t = r.parent.parent.parent.parent.parent.children[1].children[0];
                var title = _t.children[0].attribs.title;
                var dur = __results[i].parent().children('.video-time').text();
                end.push({title: title, link: link, thumbnail: thumb, duration: dur});
            }
            fulfill(end);
        });
    });
}
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
  if (message.content === 'music join') {
	  var loader = null;
	  if (message.member.voiceChannel) {
	    if (voice){
		    message.reply(" I'm already in a voice channel!");
		    return;
	    }
            message.reply(" Connecting...").then((msg) => loader = msg);
	    message.member.voiceChannel.join()
	    .then(_connection => { // Connection is an instance of VoiceConnection
	      senders[message.member.guild.id] = message.author.id;
	      connection = _connection;
	      voiceNotif = message.channel;
	      voice = message.member.voiceChannel;
	      playlist = [];
	      message.reply('Connected to ' + message.member.voiceChannel.name + "!");
	      setTimeout(function(){loader.delete()}, 500);
	      setInterval(() => {
	      	if (voice.members.size < 2){
	      		voice.leave();
	      		voice = null;
	      		voiceNotif.send(" I left the voice channel because I was all alone.");
	      		voiceNotif = null;
	      		return;
	      	}
	      	if (!voice) { console.log("voice channel null"); return; }
	      }, 1000);
	      return;
	    })
	    .catch((err) => {
		    message.reply(" I can't connect to this channel!");
		    return;
	    });
	  } else {
	    message.reply(' Join a voice channel!');
	  }
	}
	if (message.content === 'music leave') {
	  var loader = null;
	  if (senders[message.member.guild.id] == message.author.id) {
            message.reply(" Disconnecting...").then((msg) => { voice = null; loader = msg });
	    if (voice){ voice.leave(); setTimeout(function(){ loader.delete(); }, 500); message.reply("Disconnected successfully!"); } else { message.reply(Emojis.error + " I'm not in a voice channel"); }
	  } else {
	    message.reply(' Only the person who added Seb Bot to the voice channel can do this');
	  }
	}
	if (message.content == 'music que') {
		message.channel.startTyping();
		var fields = [];
		var pl = playlist.slice(0, 5);
		var thumb = playlist[0] ? playlist[0].thumbnail : "https://images.emojiterra.com/mozilla/512px/1f50a.png"
		for (i = 0; i < pl.length; i++){
			var link = pl[i];
			fields.push({name:`${i + 1}`,value:`[${link.name}](${link.url})`});
		}
		if (fields.length == 0){
			fields = [{
				name: "Oops!",
				value: "[There are no songs in the que](https://sebbot.tk/ErrorAPI?!=There%20are%20no%20songs%20in%20the%20que)"
			}]
		}
		message.reply({embed:{
			title: "Up Next",
			color: 3750201,
			fields: fields,
			thumbnail: {
				url: thumb
			},
			footer: {
			     text: `Requested by ${message.author.username}`,
			     icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
			}
		}});
		message.channel.stopTyping(true);
	}
	if (message.content.startsWith('music play')) {
		if (!voice){ message.reply(" I'm not in a voice channel, say `music join` first"); return; }
		//if (senders[message.member.guild.id] != message.author.id){ message.reply(" Only the person controlling Seb Bot, " + message.member.guild.members.find('id', senders[message.member.guild.id]).username + ", can change the song."); }
		var _file = message.content.substr(11);
		var loader = null;
		var mp = null;
		console.log("audio: " + _file);
		function c_run(file){
			//console.log(`c_run: ${file}`);
			message.reply(" Loading audio...").then((msg) => loader = msg);
			var stream = ytdl(file, { filter : 'audioonly' });
			if (playlist.length > 0){
				console.log("playlist is here");
				var title = "PaTCH Error";
				var thumb = "";
				request(file, function(e, r, b){
				    var $ = cheerio.load(b);
				    title = $('title').text().replace(" - YouTube", "");
				    thumb = $("meta[property='og:image']").attr('content');
				});
				playlist.push({name:title,url:file,thumbnail:thumb});
				message.reply(":loud_sound: Added to que");
				setTimeout(function(){loader.delete()}, 500);
				return;
			}
			try{playlist.shift()}catch(er){console.log("nothing to shift")};
			playlist.push({name:"skipped",url:"_blank"});
			var first = true;
			var dispatcher = connection.playStream(stream, {seek: 0, volume: 1})
			    dispatcher.setVolume(0.5);
			    var callback = (end) => {
				    if (playlist.length < 2){
					console.log("left channel");
					voice.leave();
					message.reply(" Since the playlist ended, I left the voice channel");
					voice = null;
				    } else {
					    if (first){
						    playlist.shift();
						    first = false;
					    }
					    console.log( playlist.shift() );
					    console.log("loading next");
					    var dispatcher = connection.playStream(ytdl(playlist[0].url));
			    			dispatcher.setVolume(0.5);
				    		dispatcher.on("end", callback);
					    console.log("now playing: " + playlist[0]);
					    voiceNotif.send(":loud_sound: Now playing: " + playlist[0].url);
				    }
			    }
			    dispatcher.on("end", callback);
			message.reply(":loud_sound: Playing video");
			setTimeout(function(){loader.delete()}, 500);
			setInterval(function(){
				if (voice.members.size == 1){
					voice.leave();
					voice = null;
					voiceNotif = null;
					voiceNotif.send(" I left the voice channel because I was all alone");
					return;
				}
				if (!voice) { console.log("voice channel null"); return; }
			}, 1000);
		}
		if (_file.includes("youtube.com") || _file.includes("youtu.be")){ //youtube
			//console.log(`running: ${_file}`);
			console.log(c_run(_file));
		} else {
			youtubeSearchEngine(_file).then((r) => {
				var fields = [];
				for (i = 0; i < r.length; i++){
					fields.push({
						name: `${i + 1}`,
						value: `[${r[i].title}](${r[i].link}) | ${r[i].duration}`
					});
				}
				message.reply({embed:{
					title: `"${_file}"`,
					color: 3750201,
					fields: fields
				}}).then((msg) => {
					var condition = (reaction, user) => user.id == message.author.id;
					var remoji = process.env.REMOJI.split(",");
					msg.react(remoji[0]).catch(() => {message.channel.send("Can't react, aborting process");return;});
					setTimeout(() => { msg.react(remoji[1]) }, 500);
					setTimeout(() => { msg.react(remoji[2]) }, 1000);
					setTimeout(() => { msg.react(remoji[3]) }, 1500);
					setTimeout(() => { msg.react(remoji[4]) }, 2000);
					msg.createReactionCollector(condition, { time: 15000 })
					  .on('collect', (_r) => {
						console.log(_r.emoji.name);
						var emoji = _r.emoji.name;
						var selected = 0;
						if (emoji == remoji[0]){
							selected = r[0];
							console.log(emoji, 1);
						} else if (emoji == remoji[1]){
							selected = r[1];
							console.log(emoji, 2);
						} else if (emoji == remoji[2]){
							selected = r[2];
							console.log(emoji, 3);
						} else if (emoji == remoji[3]){
							selected = r[3];
							console.log(emoji, 4);
						} else if (emoji == remoji[4]){
							selected = r[4];
							console.log(emoji, 5);
						}
						console.log(selected);
						message.reply({embed:{
							title: `${selected.title}`,
							url: selected.link,
							color: 3750201,
							description: `${selected.duration}`,
							thumbnail: {
								url: `${selected.thumbnail}`
							}
						}});
						c_run(selected.link);
						msg.delete();
					  });
				});
			});
		}
	}
}catch(err){console.log(err.message)}})
// Login
client.login(process.env.BOT_KEY);
