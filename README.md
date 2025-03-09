<h1 align="center">
   Discord.js v14 Handler
</h1>

<h4 align="center">
   An open-source Discord.js codebase for beginners, created by AmtiXDev
</h4>

<p align="center">
   <a href="https://nodejs.org/en/download/">
      <img src="https://img.shields.io/badge/node-^v20.11.0-purple?style=for-the-badge" alt="Node.js">
   </a>
   <a href="https://github.com/discordjs/discord.js/">
      <img src="https://img.shields.io/badge/discord.js-v14-purple?style=for-the-badge" alt="discord.js">
   </a>
   <a href="https://github.com/lifeisunusefull/Discord.js-v14-Handler">
      <img src="https://img.shields.io/badge/version-latest-purple?style=for-the-badge" alt="Latest Version">
   </a>
</p>

<p align="center">
   <a href="https://github.com/lifeisunusefull/Discord.js-v14-Handler/fork">
      <img src="https://img.shields.io/badge/Fork-GitHub-purple?logo=github&logoColor=white&style=for-the-badge" alt="GitHub Fork">
   </a>
   <a href="https://replit.com/@AmtiXDev/Discordjs-v14-Handler">
      <img src="https://img.shields.io/badge/Fork-Replit-purple?logo=replit&logoColor=white&style=for-the-badge" alt="Replit Fork">
   </a>
</p>

<p align="center">
   <a href="https://github.com/lifeisunusefull/Discord.js-v14-Handler">
      <img src="https://img.shields.io/github/forks/lifeisunusefull/Discord.js-v14-Handler?logo=github&style=social" alt="GitHub Forks">
   </a>
   <a href="https://github.com/lifeisunusefull/Discord.js-v14-Handler">
      <img src="https://img.shields.io/github/stars/lifeisunusefull/Discord.js-v14-Handler?label=Stars&logo=github&style=social" alt="GitHub Stars">
   </a>
   <a href="https://github.com/lifeisunusefull">
      <img src="https://img.shields.io/github/followers/lifeisunusefull?label=Follow&logo=github&style=social" alt="GitHub Followers">
   </a>
</p>

<br>

# Features

- Supports both slash commands ( / ) and prefix commands ( custom )
- Has a global built-in cooldown system
- Has prefix commands aliases support
- Easy to configure
- Easy to maintain
- Easy to use
- Wide Customization Options ( Managing cooldown, messages, aliases etc... )

## Installation & Setup

```bash
npm install discord.js @discordjs/rest discord-api-types ascii-table humanize-duration
```
# global installing

```bash
npm i -g discord.js-v14-handler
```

If you are using [Replit](https://replit.com/), add the following secrets to the environment variables tab (lock icon in sidebar):

- `token`
- `clientID`

---

## About

This command handler is developed by AmtiXDev (Discord: amtix) & iMorganSo (Discord: morgan.so).

**⭐ If you like it, please star our repository! ⭐**

_**Please give appropriate credit if you use, modify, or distribute this code.**_

---

## Examples

Creating an event

```js
module.exports = {
  event: "PresenceUpdate", // Or you can get the event if you have Events installed from discord.js

  run: async (client, oldPresence, newPresence) => {
    console.log(
      `${oldPresenc.user} Updated their presence to ${newPresence.data.activities[1].status}`
    );
  },
};
```

Creating a prefix command

```js
module.exports = {
  name: "help",
  description: "Displays all commands",
  aliases: ["he"], // Optional
  run: async (client, message, args) => {
    message.channel.send("Hello World!");
  },
};
```

Creating a slash command

```js
module.exports = {
  name: "help",
  description: "Helps you",
  run: async (client, interaction) => {
    await interaction.reply("Sup!!");
  }
}
```
# Installation & Setup

Install the package globally:
```bash
npm install -g discord.js-v14-handler
```

Initialize the handler:
```bash
djs-handler build ./
```

This will create the necessary folder structure and configuration files for your Discord bot.
## Contact && Support

Discord: `amtix`, `morgan.so`, `vueos`

For any issues or inquiries, feel free to reach out on our Discord server:

[![Discord Banner](https://api.weblutions.com/discord/invite/FqceHDU8QP/)](https://discord.gg/FqceHDU8QP)

For Donation: https://paypal.me/amtixdev (amtixdev@gmail.com)
