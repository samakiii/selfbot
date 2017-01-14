let Discord = require("discord.js");
let bot = new Discord.Client();
let config = require('./config.json');
var moment = require('moment')

function AaN(args, i) {
  if (args[i] === null || args[i] === "" || args[i] === undefined) return true;
  return false;
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`);
  console.log(`${bot.user.username}, your selfbot is online and ready to rock and roll!`)
  console.log(`${bot.user.username}, you're on ${bot.guilds.size} servers with ${bot.channels.size} channels and with ${bot.users.size} users`)
});


bot.on('message', msg => {
  if (msg.author.id !== bot.user.id) return; //Only allows you to work with it, since it's called a selfbot :P

  let prefix = config.prefix;
  let channel = msg.channel;
  let guild = msg.guild;
  let text = msg.content;
  let args = text.split(" ");
  let command = text.substring(prefix.length, args[0].length).toLowerCase();

  if (command == "ping") {
     startTime = Date.now();
     channel.sendMessage("Pinging...").then((msg) => {
         endTime = Date.now();
         msg.edit(`Pong! \`${Math.round(endTime - startTime)} ms\``);
     });
 }

 if (command == "purge") {
     var amount = parseInt(args[1]);
     msg.channel.fetchMessages({
             limit: amount
         })
         .then(messages => {
             messages.map(msg => msg.delete().catch(console.error));
         }).catch(console.error);
 } else if (command == "clear") { //p delets your messages. purge deletes everyones messages.
     let delamount = parseInt(args[1]) ? parseInt(args[1]) : 1;
     msg.channel.fetchMessages({
             limit: 100
         })
         .then(messages => {
             msgar = messages.array();
             msgar = msgar.filter(msg => msg.author.id === bot.user.id);
             msgar.length = delamount + 1;
             msgar.map(msg => msg.delete().catch(console.error));
         });
 }

 if (command == "get") {
     var user = msg.mentions.users.first();
     if (!user) {
         var avatar = msg.author.avatarURL;
         msg.channel.sendFile(avatar);
     } else {
         var userav = msg.mentions.users.first();
         var avatar = userav.avatarURL;
         msg.channel.sendFile(avatar);
         msg.channel.sendMessage("**Beep**")
     }
 };

  

if (msg.content === prefix + "uptime") {
    var date = new Date(bot.uptime);
    var strDate = '**';
    strDate += 'Selfbot Uptime\n';
    strDate += date.getUTCDate() - 1 + ' days, ';
    strDate += date.getUTCHours() + ' hours, ';
    strDate += date.getUTCMinutes() + ' minutes, ';
    strDate += date.getUTCSeconds() + ' seconds**';
    msg.channel.sendMessage(strDate)
}

if (msg.content.toLowerCase() == prefix + 'r' || msg.content.toLowerCase() == prefix + 'reload') {
    msg.channel.sendMessage(`***Selfbot Restarting...***`).then(function(t) {
        process.exit(1);
    });
}

var winston = require('winston');
var util = require('util')
if (command === "eval") {
    let suffix = msg.content.slice(6);

    try {
        let evaled = eval(suffix);
        let type = typeof evaled;
        let insp = util.inspect(evaled, {
            depth: 0
        });
        let tosend = [];

        if (evaled === null) evaled = 'null';

        if (evaled.toString().includes(bot.token) ||
            insp.toString().includes(bot.token)) return msg.edit('Cannot complete eval due to token.');

        tosend.push('**EVAL:**');
        tosend.push('\`\`\`xl');
        tosend.push(clean(suffix));
        tosend.push('\`\`\`');
        tosend.push('**Evaluates to:**');
        tosend.push('\`\`\`xl');
        tosend.push(clean(evaled));
        tosend.push('\`\`\`');
        if (evaled instanceof Object) {
            tosend.push('**Inspect:**');
            tosend.push('\`\`\`xl');
            tosend.push(insp);
            tosend.push('\`\`\`');
        } else {
            tosend.push('**Type:**');
            tosend.push('\`\`\`xl');
            tosend.push(type);
            tosend.push('\`\`\`');
        }
        msg.edit(tosend.join('\n'));
        winston.log('info', `Evaluated ${tosend.join('\n')}`);
    } catch (err) {
        let tosend = [];
        tosend.push('**EVAL:** \`\`\`xl');
        tosend.push(clean(suffix));
        tosend.push('\`\`\`');
        tosend.push('**Error:** \`\`\`xl');
        tosend.push(clean(err.stack));
        tosend.push('\`\`\`');
        msg.edit(tosend.join('\n'));
        winston.log('info', `Error: ${tosend.join('\n')}`);
    }
}

function clean(text) {
    if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
}
    
    
 if (command == "userinfo") {
    var embed = new Discord.RichEmbed();
    embed.addField("Username", `${msg.author.username}#${msg.author.discriminator}`, true)
        .addField("ID", `${msg.author.id}`, true)
        .setColor(0xf44242)
        .setFooter(' ', ' ')
        .setThumbnail(`${msg.author.avatarURL}`) 
        .setTimestamp()
        .setURL(`${msg.author.avatarURL}`)
        .addField('Currently', `${msg.author.presence.status}`, true)
        .addField('Game', `${msg.author.presence.game === null ? "No Game" : msg.author.presence.game.name}`, true)
        .addField('Joined Discord', `${moment(msg.author.createdAt).format('MM.DD.YY')}`, true)
        .addField('Joined Server', `${moment(msg.member.joinedAt).format('MM.DD.YY')}`, true)
        .addField('Roles', `\`${msg.member.roles.filter(r => r.name).size}\``, true)
        .addField('Is Bot', `${msg.author.bot}`, true)
    msg.channel.sendEmbed(
        embed, {
            disableEveryone: true
        }
    );
}
if (msg.content === prefix + "serverinfo") {
    var embed = new Discord.RichEmbed();
    embed.addField("Server Name", `${msg.guild.name}`, true)
        .addField("Server ID", `${msg.guild.id}`, true)
        .setColor(0xf5a020)
        .setFooter(' ', ' ')
        .setThumbnail(`${msg.guild.iconURL}`) 
        .setTimestamp()
        .setURL(`${msg.author.avatarURL}`)
        .addField('Guild Owner', `${msg.guild.owner.user.username}`, true)
        .addField('Owner ID', `${msg.guild.owner.id}`, true)
        .addField('Guild Created', `${moment(msg.guild.createdAt).format('MM.DD.YY')}`, true)
        .addField('Roles', `${msg.guild.roles.filter(r => r.name).size}`, true)
        .addField('Verification Level', `${msg.guild.verificationLevel}`, true)
        .addField('Region', `${msg.guild.region}`, true)
    msg.channel.sendEmbed(
        embed, {
            disableEveryone: true
        }
    );
}
if (command == "whois") {
    var mention = msg.mentions.users.first();
    if (msg.mentions.users.size === 0) {
        return msg.channel.sendMessage(":x: | Please mention a user.")
    }
    var embed = new Discord.RichEmbed();
    embed.addField("Username", `${mention.username}#${mention.discriminator}`, true)
        .addField("ID", `${mention.id}`, true)
        .setColor(0x77f442)
        .setThumbnail(`${mention.avatarURL}`) 
        .setURL(`${mention.avatarURL}`)
        .addField('Currently', `${mention.presence.status}`, true)
        .addField('Game', `${mention.presence.game === null ? "No Game" : mention.presence.game.name}`, true)
        .addField('Joined Discord', `${moment(mention.createdAt).format('MM.DD.YY')}`, false)
    msg.channel.sendEmbed(
        embed, {
            disableEveryone: true
        }
    );
}

if (command == "help") {
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`Selfbot Commands`)
        .setColor(0xd12121)
        .setDescription("**ping**\nA timestamp of how long it takes to respond.\n**whois**\nShows another's user information!\n**userinfo**\nShows you your user information.\n**uptime**\nShows the uptime of the bot.\n**embed**\nPuts your message inside of an embed\n**eval**\nI don\'t feel like explaining this one\n**purge**\nPurges everyones messages if `MANAGE_MESSAGE` is available.\n**clear**\nClears all of your messages.\n**get**\nSteal somebodys avatar <:lul:264695334427426816>")
        .setFooter(' ', ' ')
        .setTimestamp()
    msg.channel.sendEmbed(
        embed, {
            disableEveryone: true
        }
    );
}
        
        if (command == 'notify') {
           let noto = msg.content.split(" ").slice(1).join(" ");
           msg.delete();
           msg.channel.sendMessage("<@&252167569677615106>")
           msg.channel.sendMessage("", {
               embed: {
                   color: 0xfff00,
                   author: {
                       name: `Announcement`,
                       icon_url: msg.author.avatarURL
                   },
                   description: noto
               }
           });
       }

       if (command == 'embed') {
           let noto = msg.content.split(" ").slice(1).join(" ");
           msg.delete();
           msg.channel.sendMessage("", {
               embed: {
                   color: 0x42f453,
                   author: {
                       icon_url: msg.author.avatarURL
                   },
                   description: noto
               }
           });
       }
        
                if (msg.content.toLowerCase().startsWith(prefix + "cb")) {
                    var cb = msg.content.split(" ").slice(1).join(" ");
                    msg.delete();
                    msg.channel.sendMessage("```js\n" + cb + "\n```");
                }

                if (command == "friend") {
                    if (!msg.mentions.users.first()) return msg.edit('**Friend** > Failed, no user.');

                    msg.mentions.users.first().addFriend().then(() => {
                        msg.edit("**Friend** > Done");
                    })
                }

                if (command == "unfriend") {
                    if (!msg.mentions.users.first()) return msg.edit('**Friend** > Failed, no user.');

                    msg.mentions.users.first().removeFriend().then(() => {
                        msg.edit("**Removed Friend** > Done");
                    })
                }

if (command == "invite")
    msg.guild.channels.get(`${msg.channel.id}`).createInvite().then(invite => msg.channel.sendMessage('http://discord.gg/' + invite.code));

		  if (command == "afk") {
		      let nickname = msg.guild.member(bot.user).nickname;
		      let username = msg.guild.member(bot.user).user.username;
		      if (!nickname) {
		          msg.guild.member(bot.user).setNickname(username + ' [is AFK]').then(() => {
		              msg.edit('Set to away from keyboard').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		          }).catch(error => console.log(error.stack));
		      } else

		      if (nickname.search(' [is AFK]')) {
		          msg.guild.member(bot.user).setNickname('').then(() => {
		              msg.edit('No longer AFK').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		          }).catch(error => console.log(error.stack));
		      } else

		      if (nickname && !nickname.includes(' [is AFK]')) {
		          msg.guild.member(bot.user).setNickname(nickname + ' [is AFK]').then(() => {
		              msg.edit('Set to Away From Keyboard').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		          }).catch(error => console.log(error.stack));
		      } else if (nickname.search(' [is AFK]')) {
		          msg.guild.member(bot.user).setNickname(nickname.replace(/ \[AFK\]/g, '')).then(() => {
		              msg.edit('No longer AFK').then(response => response.delete(1000).catch(error => console.log(error.stack)));
		          }).catch(error => console.log(error.stack));
		      }
		  }


if (command == "ban") {
    var user = msg.mentions.users.first();
    var member = msg.guild.member(user);
    var reason = msg.content.split(' ').slice(2).join(' ');
    if (!user)
        return msg.channel.sendMessage('Please include a user to ban.');
    if (!reason)
        return msg.channel.sendMessage('Please include a reason.');
    member.ban().then(() => {
        msg.channel.sendMessage(`***${user.username} has been banned.***`)
        user.sendMessage(`You have been **banned** from **${msg.guild.name}** by: **${msg.author.username}** for **${reason}**`)
        var embed = new Discord.RichEmbed();
        embed.setAuthor(`Moderator`, ` `)
            .setColor(0xef2828)
            .setDescription(`${msg.author.username}`, true)
            .setThumbnail(`${user.avatarURL}`)
            .setTimestamp()
            .addField('User Warned', `${user.username}`, true)
            .addField('Reason', `${reason}`, true)
        msg.guild.channels.find('name', 'mod-log').sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    });
}
if (command == "warn") {
    var reason = msg.content.split(' ').slice(2).join(' ');
    var user = msg.mentions.users.first();
    if (!user)
        return msg.channel.sendMessage('Please include a user to warn.');
    if (!reason)
        return msg.channel.sendMessage('Please include a reason.');
    user.sendMessage(`You have been __**warned**__ in **${msg.guild.name}** by: **${msg.author.username}** for **${reason}**`)
    msg.channel.sendMessage(`***${user.username}*** ***Has been warned*** 👌`)
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`Moderator`, ` `)
        .setColor(0xba5e18)
        .setDescription(`${msg.author.username}`, true)
        .setThumbnail(`${user.avatarURL}`)
        .setTimestamp()
        .addField('User Warned', `${user.username}`, true)
        .addField('Reason', `${reason}`, true)
    msg.guild.channels.find('name', 'mod-log').sendEmbed(
        embed, {
            disableEveryone: true
        }
    );
}
if (msg.content.startsWith(prefix + 'kick')) {
    var user = msg.mentions.users.first();
    var member = msg.guild.member(user);
    var reason = msg.content.split(' ').slice(2).join(' ');
    if (!user)
        return msg.channel.sendMessage('Please include a user to kick.');
    if (!reason)
        return msg.channel.sendMessage('Please include a reason.');
    member.kick().then(() => {
        msg.channel.sendMessage(`***${user.username} has been kicked.***`)
        user.sendMessage(`You have been __**kicked**__ from **${msg.guild.name}** by: **${msg.author.username}** for **${reason}**`)
        var embed = new Discord.RichEmbed();
        embed.setAuthor(`Moderator`, ` `)
            .setColor(0xe8c330)
            .setDescription(`${user.username}`, true)
            .setThumbnail(`${user.avatarURL}`)
            .setTimestamp()
            .addField('User Kicked', `${user.username}`, true)
            .addField('Reason', `${reason}`, true)
        msg.guild.channels.find('name', 'mod-log').sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    });
}
});
bot.login(config.token);
