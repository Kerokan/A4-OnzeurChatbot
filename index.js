'use strict'

const conf = require('./config');
const genius = require('./genius');
const Discord = require('discord.js');
const {Wit, log} = require('node-wit');

const client = new Wit({accessToken: conf.Wit.accessToken});

const token = conf.Discord.Token;

const bot = new Discord.Client();
bot.login(token);
bot.on('ready', () => {
  console.log('Logged in as ' + bot.user.tag);
});

bot.on('message', async msg => {
  if (msg.content.startsWith('!onzeur')) {
    var message = msg.content;
    message = message.replace('!onzeur ','');
    client.message(message, {})
    .then((data) => {
      genius(data).then((result) => {
        msg.channel.send(result);
      })
    })
    .catch(console.error);
  }
});
