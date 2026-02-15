import axios from 'axios'
import FormData from 'form-data'

function generateUniqueFilename(mime) {
  const ext = mime.split('/')[1] || 'bin'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${id}.${ext}`
}

async function uploadToCatbox(buffer, mime) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename: generateUniqueFilename(mime) })

  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  if (typeof res.data !== 'string' || !res.data.startsWith('https://')) {
    throw new Error('Respuesta inválida de Catbox')
  }
  return res.data.trim()
}

export default {
  command: ['seticon'],
  category: 'socket',
  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...global.owner.map((number) => number + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2 && m.sender !== owner) return m.reply(mess.socket)
    const value = args.join(' ').trim()

    if (!value && !m.quoted && !m.message.imageMessage)
      return m.reply('✿ Debes enviar o citar una imagen para cambiar el icon del bot.')

    if (value.startsWith('http')) {
      config.icon = value
      return m.reply(`❖ Se ha actualizado el icon de *${config.namebot2}*!`)
    }

    const q = m.quoted ? m.quoted : m.message.imageMessage ? m : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/image\/(png|jpe?g|gif)/.test(mime))
      return m.reply('❖ Responde a una imagen válida.')

    const media = await q.download()
    if (!media) return m.reply('✿ No se pudo descargar la imagen.')

    try {
      const link = await uploadToCatbox(media, mime)
      config.icon = link
      return m.reply(`✿ Se ha actualizado el icon de *${config.namebot2}*!`)
    } catch (e) {
      return m.reply(msgglobal)
    }
  },
}