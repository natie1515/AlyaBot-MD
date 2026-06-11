import db from "#db";
import { getDevice, prepareWAMessageMedia } from 'baileys';
import fs from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';
import { bodyMenu, menuObject } from '#system/commandos'; // Importación solicitada

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
      const canalId = botSettings.newsletter_id || '';
      const canalName = botSettings.nameid || '';
      const link = botSettings.link || '';

      const isOficialBot = botId === global?.sock ? global?.sock?.user?.id?.split(':')[0] + '@s.whatsapp.net' : '';
      const botType = isOficialBot ? 'Owner' : 'Sub Bot';
      const userr = await db.getUser();
      const users = Object.keys(userr).length || 0;
      const time = sock.uptime ? formatearMs(Date.now() - sock.uptime) : 'Desconocido';
      const device = getDevice(msg.key.id);
      const own = await db.getUser(owner);
      const sender = msg.pushName || 'Usuario';

      // Lógica de construcción del menú combinando bodyMenu y menuObject
      const sections = menuObject;
      const content = Object.values(sections).map(s => String(s || '')).join('\n\n');
      let menu = bodyMenu ? String(bodyMenu || '') + '\n\n' + content : content;

      // Reemplazo de variables
      const replacements = {
        '$owner': owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? (own?.name || owner.split('@')[0]) : owner) : 'Oculto',
        '$botType': botType,
        '$device': device,
        '$tiempo': tiempo,
        '$tempo': tiempo2,
        '$users': users.toLocaleString(),
        '$link': link,
        '$sender': sender,
        '$botname': botname,
        '$namebot': botname2,
        '$prefix': prefix,
        '$uptime': time
      };

      for (const [key, value] of Object.entries(replacements)) {
        menu = menu.replace(new RegExp(`\\${key}`, 'g'), value);
      }

      const isVideo = banner.includes('.mp4') || banner.includes('.gif') || banner.includes('.webm');
      const contextBase = { 
        mentionedJid: [owner, msg.sender], 
        isForwarded: true, 
        forwardedNewsletterMessageInfo: { newsletterJid: canalId, serverMessageId: '0', newsletterName: canalName } 
      };

      if (isVideo) {
        await sock.sendMessage(msg.chat, { video: { url: banner }, caption: menu.trim(), contextInfo: contextBase }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.chat, { 
          text: menu.trim(), 
          linkPreview: link && banner ? (await prepareWAMessageMedia({ image: { url: banner } }, { upload: sock.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }).then(({ imageMessage }) => ({ 'canonical-url': link, 'matched-text': link, title: botname, description: `${botname2}, Built With 💛 By Stellar`, jpegThumbnail: imageMessage?.jpegThumbnail ? Buffer.from(imageMessage.jpegThumbnail) : undefined, highQualityThumbnail: imageMessage || undefined }))) : undefined, 
          contextInfo: contextBase 
        }, { quoted: msg });
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
