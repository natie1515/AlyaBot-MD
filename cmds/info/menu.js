import db from "#db";
import { getDevice, prepareWAMessageMedia } from 'baileys';
import fs from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';
import { commands } from '../../lib/system/comandos.js';

function normalize(text = '') {
  text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  return text.endsWith('s') ? text.slice(0, -1) : text;
}

export default {
  command: ['allmenu', 'help', 'menu', 'ayuda'],
  category: 'info',
  run: async ({ msg, sock, args, command, text, usedPrefix: prefix }) => {
    try {
      const now = new Date();
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const tiempo = colombianTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
      const tiempo2 = moment.tz('America/Bogota').format('hh:mm A');

      const botId = sock?.user?.id.split(':')[0] + '@s.whatsapp.net' || '';
      const botSettings = await db.getSettings(botId);
      const botname = botSettings.namebot || '';
      const botname2 = botSettings.namebot2 || '';
      const banner = botSettings.banner || '';
      const owner = botSettings.owner || '';
      const link = botSettings.link || '';
      const canalId = botSettings.newsletter_id || '';
      const canalName = botSettings.nameid || '';

      const alias = {
        anime: ['anime', 'reacciones'],
        downloads: ['downloads', 'descargas'],
        economia: ['economia', 'economy', 'eco'],
        gacha: ['gacha', 'rpg'],
        grupo: ['grupo', 'group'],
        nsfw: ['nsfw', '+18'],
        profile: ['profile', 'perfil'],
        sockets: ['sockets', 'bots'],
        stickers: ['stickers', 'sticker'],
        utils: ['utils', 'utilidades', 'herramientas']
      };

      const input = normalize(args[0] || '');
      const cat = Object.keys(alias).find(k => alias[k].map(normalize).includes(input));
      
      if (args[0] && !cat) {
        return msg.reply(`《✧》 La categoria *${args[0]}* no existe, las categorias disponibles son: *${Object.keys(alias).join(', ')}*.\n> Para ver la lista completa escribe *${prefix}menu*\n> Para ver los comandos de una categoría escribe *${prefix}menu [categoría]*\n> Ejemplo: *${prefix}menu anime*`);
      }

      const isOficialBot = botId === global?.sock ? global?.sock?.user?.id?.split(':')[0] + '@s.whatsapp.net' : '';
      const botType = isOficialBot ? 'Owner' : 'Sub Bot';
      const userr = await db.getUser();
      const users = Object.keys(userr).length || 0;
      const time = sock.uptime ? formatearMs(Date.now() - sock.uptime) : 'Desconocido';
      const device = getDevice(msg.key.id);
      const own = await db.getUser(owner);

      let menu = `> *¡ʜᴏʟᴀ!* ${msg.pushName}, como está tu día?, mucho gusto mi nombre es *${botname2}* ʚ♡⃛ɞ(ू•ᴗ•ू❁)*\n\n   ⌒࣪᷼⏜͡  ۪  ࿚ꨪᰰ࿙  ࣭࣪⢏࣭۟⢢࣭ׄ᎐፝֟᎐࣭ׄ⡔࣭۟⡹࣭ׄ  ࿚ꨪᰰ࿙  ۪  ͡⏜ׄ᷼⌒\n\n: ̗̀〄 *ᴅᴇᴠᴇʟᴏᴘᴇʀ ::* ${owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? `${own?.name || owner.split('@')[0]}` : owner) : 'Oculto'}\n: ̗̀ꕥ *ᴛɪᴘᴏ ::* ${botType}\n: ̗̀☄︎ *sɪsᴛᴇᴍᴀ/ᴏᴘʀ ::* ${device}\n\n: ̗̀❖ *ᴛɪᴍᴇ ::* ${tiempo}, ${tiempo2}\n: ̗̀❖ *ᴜsᴇʀs ::* ${users.toLocaleString()}\n: ̗̀❖ *ᴍɪ ᴛɪᴇᴍᴘᴏ ::* ${time}\n: ̗̀❖ *ᴜʀʟ ::* ${link}\n\n   ⌒࣪᷼⏜͡  ۪  ࿚ꨪᰰ࿙  ࣭࣪⢏࣭۟⢢࣭ׄ᎐፝֟᎐࣭ׄ⡔࣭۟⡹࣭ׄ  ࿚ꨪᰰ࿙  ۪  ͡⏜ׄ᷼⌒\n\n⋆｡ﾟ☁︎ ｡° *ᴄᴏᴍ꯭ᴀ꯭ɴᴅᴏs${cat ? ` para \`${cat}\`` : ''}* ﾟ｡˚₊ 𓂃\n`;

      const categories = {};
      for (const command of commands) {
        const category = command.category || 'otros';
        if (!categories[category]) categories[category] = [];
        categories[category].push(command);
      }

      for (const [category, cmds] of Object.entries(categories)) {
        if (cat && category.toLowerCase() !== cat) continue;
        const catName = category.charAt(0).toUpperCase() + category.slice(1);
        menu += `\n╭╼ׅࣶ፝֟╾╌ֵ╾͜─ํ͜┈ְ ࣭࣪⢏࣭ࣧ⢢࣭ׄ᎐፝֟͟͝᎐࣭ׄ⡔࣭ࣧ⡹࣭࣭ׄ࣪ ְ┈ํ͜─͜╼ꨪᰰ╾࣮╌╼ࣶׅ፝֟╾╮\n│❀ *${catName} ☆(ﾉ◕ヮ◕)ﾉ*\n├╾ׅ╴ׂ╌╶ׅ╌ׂ─ 〫─ׂ┄ׅ╴ׂ╌ׅ╶╼.  ╾ׅ╴ׂ╌╶ׅ╌ׂ\n`;
        cmds.forEach((cmd) => {
          const aliases = cmd.alias.map(a => `${prefix}${a.split(/[\/#!+.\-]+/).pop().toLowerCase()}`).join(' › ');
          menu += `│✿ ${aliases} ${cmd.uso ? `+ ${cmd.uso}` : ''}\n> ✺ ${cmd.desc}\n`;
        });
        menu += `╰╼ׅࣶ፝֟╾╌ֵ╾͜─ํ͜┈ְ ࣭࣪⢏࣭ࣧ⢢࣭ׄ᎐፝֟͟͝᎐࣭ׄ⡔࣭ࣧ⡹࣭ׄ ְ┈ํ͜─͜╼ꨪᰰ╾࣮╌╼ࣶׅ፝֟╾╯ \n`;
      }

      menu += `\n> *${botname2} desarrollado por Diego* ૮(˶ᵔᵕᵔ˶)ა`;

      const isVideo = banner.includes('.mp4') || banner.includes('.gif') || banner.includes('.webm');
      const contextBase = { mentionedJid: [owner, msg.sender], isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: canalId, serverMessageId: '0', newsletterName: canalName } };

      if (isVideo) {
        await sock.sendMessage(msg.chat, { video: { url: banner }, caption: menu.trim(), contextInfo: contextBase }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.chat, { text: menu.trim(), linkPreview: link && banner ? (await prepareWAMessageMedia({ image: { url: banner } }, { upload: sock.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }).then(({ imageMessage }) => ({ 'canonical-url': link, 'matched-text': link, title: botname, description: `${botname2}, Built With 💛 By Stellar`, jpegThumbnail: imageMessage?.jpegThumbnail ? Buffer.from(imageMessage.jpegThumbnail) : undefined, highQualityThumbnail: imageMessage || undefined }))) : undefined, contextInfo: contextBase }, { quoted: msg });
      }
    } catch (e) {
      await msg.reply(`Error: ${e.message}`);
    }
  },
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`].filter(Boolean).join(' ');
}
