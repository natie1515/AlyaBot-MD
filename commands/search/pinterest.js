import fetch from 'node-fetch'

export default {
  command: ['pinterest', 'pin'],
  category: 'search',
  run: async (client, m, args, from) => {
    const text = args.join(' ')
    const isPinterestUrl = /^https?:\/\//.test(text)

    if (!text) {
      return m.reply(
        `🍒 Ingresa un *término* de búsqueda o un enlace de *Pinterest*.`,
      )
    }

    try {
      if (isPinterestUrl) {

        const pinterestUrl = `${api.url}/dl/pinterest?url=${encodeURIComponent(text)}&key=${api.key}`
        const ress = await fetch(pinterestUrl)

        if (!ress.ok)
          throw new Error(`La API devolvió un código de error: ${ress.status}`)

        const json = await ress.json()
        const result = json.data || json.result || json

        if (!result || !result.dl)
          throw new Error('Respuesta inválida de API')

        const mediaType =
          result.type === 'video'
            ? 'video'
            : 'image'

        const message2 =
          `🍁 ꨩᰰ𑪐𑂺 ˳ ׄ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 ࣭𑁯ᰍ ̊ ܃܃\n\n` +
          `> 🍃 Resultados para tu enlace › *${text}*\n\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Título › *${result.title || 'Sin título'}*\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Tipo › *${result.type === 'video' ? 'Video' : 'Imagen'}*`

        await client.sendMessage(
          m.chat,
          { [mediaType]: { url: result.dl }, caption: message2 },
          { quoted: m },
        )

      } else {

        const pinterestAPI =
          `${api.url}/search/pinterest?query=${encodeURIComponent(text)}&key=${api.key}`

        const res = await fetch(pinterestAPI)

        if (!res.ok)
          throw new Error(`La API devolvió un código de error: ${res.status}`)

        const jsons = await res.json()
        const json = jsons.data || []

        if (!json.length) {
          return m.reply(`✐ No se encontraron resultados para *${text}*`)
        }

        const index = Math.floor(Math.random() * json.length)
        const result = json[index]

        const message =
          `🍁 ꨩᰰ𑪐𑂺 ˳ ׄ 𝖯𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝗍 𝖲𝖾𝖺𝗋𝖼𝗁 ࣭𑁯ᰍ ̊ ܃܃\n\n` +
          `> 🍃 Resultados para › *${text}*\n\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Título › *${result.title || 'Sin título'}*\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Descripción › *${result.description || 'Sin descripción'}*\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Autor › *${result.full_name || 'Desconocido'}*\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Likes › *${result.likes || '0'}*\n` +
          `𖣣ֶㅤ֯⌗ 🍄̷ ׄ ⬭ Publicado › *${result.created || 'Desconocido'}*`

        await client.sendMessage(
          m.chat,
          { image: { url: result.hd }, caption: message },
          { quoted: m },
        )
      }

    } catch (e) {
      console.log('[Pinterest Error]', e)
      await client.reply(m.chat, msgglobal, m)
    }
  },
}
