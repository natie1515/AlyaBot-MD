import fs from 'fs'

export default {
  command: ['delsub'],
  category: 'socket',
  run: async (client, m, args) => {
    if (!args[0]) return m.reply('Número?')

    const id = args[0].replace(/\D/g, '')
    const folder = `./Sessions/Subs/${id}`

    global.deletedSubs.add(id)

    const conn = global.conns.find(c => c.userId === id)
    if (conn) {
      try { conn.ws.close() } catch {}
      global.conns = global.conns.filter(c => c.userId !== id)
    }

    if (fs.existsSync(folder))
      fs.rmSync(folder, { recursive: true, force: true })

    m.reply('Sesión eliminada correctamente')
  }
}
