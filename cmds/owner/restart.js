import {getUser, updateUser, getChat, updateChat, getChatUser, updateChatUser, getSettings, updateSettings, getStickersPack, updateStickersPack, deletedb, setCreate} from "#database"
export default {
  command: ['restart'],
  category: 'mod',
  isOwner: true,
  run: async ({ msg, sock }) => {
    await sock.reply(msg.chat, `✎ Reiniciando el Socket...\n> *Espere un momento...*`, msg)
    setTimeout(() => {
      process.exit(0)
    }, 3000)
  },
};
