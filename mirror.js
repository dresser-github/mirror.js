const Discord = require("discord.js");
const client = new Discord.Client();
const { Client, RichEmbed } = require('discord.js'); 
const config = require('./config.json');
const fs = require("fs");
const ms = require("ms");
const annoncechannel = "666270582928572427";


client.login(process.env.MIRROR);


client.on("ready", () => {
  console.log(
    "Bot: MIRROR " +
      `${client.users.size}` +
      " users, in " +
      `${client.channels.size}` +
      " channels of " +
      `${client.guilds.size}` +
      " guilds."
  );

  //bot status
  client.user.setStatus("online");
  client.user.setPresence({
    game: {
      name: "/help",
      type: "STREAMING",
      url:
        "https://www.youtube.com/channel/UCjjsEnIg5cDkw35UCD35bUA?view_as=subscriber"
    }
  });
});


//discord invites
client.on('message', (message) => { //whenever a message is sent
  if (message.content.includes('discord.gg/'||'discordapp.com/invite/')) { //if it contains an invite link 
    const arrayOfUsersIds = ['595030276804050945', '472320129514864651'];

    for (let i = 0; i < arrayOfUsersIds.length; i++) {
    if (message.author.id === arrayOfUsersIds[i]) return;
  };
    message.delete() //delete the message 
      .then(message.channel.send("<@" + message.author.id + ">" + " Пожалуйста, не отправляйте приглашения в чат!"))
  }
});


//bot mention
client.on('message', message => {
  if (message.content === '<@632570913858125824>') {
    message.channel.send('**Чтобы посмотреть список коммадн напишите  ``/help``**');
  }
}); 


//commands
client.on("message", async message => {
  
  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  

  //help command
    if(command === "help") {
    let help = new Discord.RichEmbed()
      .setAuthor('MIRROR', 'https://cdn.discordapp.com/avatars/632570913858125824/1aa2c052174d4f332855a9440c994bc2.png', 'https://discord.gg/Rnb9SSU')
      .setDescription(' Список доступных комманд:')
      .setColor("#8b00ff") 
      .setThumbnail('https://cdn.discordapp.com/avatars/632570913858125824/1aa2c052174d4f332855a9440c994bc2.png')
      .addField("➣ Avatar", "/avatar [member]")
      .addField("➣ Say", "/say [message]")
      .addField("➣ Embed", "/embed [message]")
      .addField("➣ Kick", "/kick [member] [reason]")
      .addField("➣ Ban", "/ban [member] [reason]")
      .addField("➣ Random number", "/ramdom") 
      .addField("➣ Ping", "/ping")
      .addField("➣ Free", "/free")
      .addField("➣ VK", "/vk")
      .setFooter(message.author.username, message.author.displayAvatarURL);
    return message.channel.send(help);
  } 


    if(command === "server") {
    let server = new Discord.RichEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL)
      .addField("Name", message.guild.name)
      .addField("Owner", message.guild.owner.user.username)
      .addField("Channels", message.guild.channels.size)
      .addField("Roles", message.guild.roles.size)
      .setThumbnail(message.guild.iconURL)
    return message.channel.send(server);
}


  //free command
   if(command === "free") {  
   var role = message.guild.roles.find(role => role.name === "『 Vip 』");
   message.member.addRole(role); 
   message.delete().catch(O_o=>{}); 
   message.channel.send("**Вы получили роль**  ``" + role.name + "``  ✓").then(function(message) {
    message.delete(3000);
  });
  }


  //random number command
    if(command === "random") {
    var random = Math.floor(Math.random() *100)+1;
    message.channel.send(random);
  }


  //say command
    if(command === "say") {
    if(!message.member.hasPermission("ADMINISTRATOR")){
    return message.channel.send("Извините, у вас нет разрешения для использование этой комманды!").catch(console.error);
    }
      
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
  }


  //embed command
    if(command === "embed") {
    if(!message.member.hasPermission("ADMINISTRATOR")){
    return message.channel.send("Извините, у вас нет разрешения для использование этой комманды!").catch(console.error);
    }
    const embedMessage = args.join(" ");  
    const embed = new RichEmbed()  
       .setColor("#8b00ff") 
       .setTitle(embedMessage) 
    message.delete().catch(O_o=>{}); 
    message.channel.send(embed) 
  } 


  //avatar command
    if(command === "avatar") {
       let user = message.mentions.users.first();
    if(!user) user = message.author;
    let color = message.member.displayHexColor;
    if (color == '#A020F0') color = message.member.hoistRole.hexColor;
    const embed = new Discord.RichEmbed()
                   .setImage(user.avatarURL)
                   .setColor(0x8b00ff)
    message.channel.send({embed});
  }

  
  //ping command
    if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`**Pong! ${m.createdTimestamp - message.createdTimestamp}ms**`);
  } 
  
  
  //social network
    if(command === "vk") {
          const embed = new RichEmbed() 
      .setTitle('Группа ВКонтакте')
      .setColor(0x8b00ff)
      .setURL('https://vk.com/mirrords')
    message.channel.send(embed);
  }

  
  //kick command
    if(command === "kick") {
    if(!message.member.hasPermission("KICK_MEMBERS")){
    return message.channel.send("Извините, у вас нет разрешения для использование этой комманды!").catch(console.error);
    }
    
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.channel.send("Пожалуйста, укажите кого вы хотите кикнуть!");
    if(!member.kickable) 
      return message.channel.send("У вас недостаточно прав чтобы кикнуть этого пользователя!");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Причина не указана.";
    
    await member.kick(reason)
      .catch(error => message.channel.send(`Извините ${message.author} Я не могу кинуть из-за : ${error}`));
    message.channel.send(`${member.user.tag} был кикнут пользователем <@${message.author.id}> по причине: ${reason}`);
  }
  
  
  //ban command
    if(command === "ban") {
    if(!message.member.hasPermission("BAN_MEMBERS")){
    return message.channel.send("Извините, у вас нет разрешения для использование этой комманды!").catch(console.error);
    }
    
    let member = message.mentions.members.first();
    if(!member)
      return message.channel.send("Пожалуйста, укажите кого вы хотите забанить!");
    if(!member.bannable) 
      return message.channel.send("У вас недостаточно прав чтобы забанить этого пользователя!");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Причина не указана.";
    
    await member.ban(reason)
      .catch(error => message.channel.send(`Извините ${message.author} я не мог забанить из-за : ${error}`));
    message.channel.send(`${member.user.tag} был забанен пользователем <@${message.author.id}> по причине: ${reason}`);
  }
  

  //clear command
    if(command === "clear") {
      
    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 1000)
      return message.channel.send("Пожалуйста, укажите сколько сообщений вы хотите удалить!");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send(`Не удалось удалить сообщения из-за: ${error}`));
  }
}); 
