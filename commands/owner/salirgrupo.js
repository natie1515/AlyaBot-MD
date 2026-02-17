import fs from 'fs'
import path from 'path'

export default {
  command: ['delsub', 'delsession'],
  category: 'socket',
  owner: true, // opcional: solo dueño
  run: async (client, m, args) => {
    if (!args[0]) {
      return m.reply('✎ Usa: delsub número\nEjemplo: delsub 5491122334455')
    }

    const id = args[0].replace(/\D/g, '')
    const sessionPath = `./Sessions/Subs/${id}`

    // Cerrar socket si está activo
    const connIndex = global.conns.findIndex(c => c.userId === id)
    if (connIndex !== -1) {
      try {
        await global.conns[connIndex].ws.close()
      } catch {}
      global.conns.splice(connIndex, 1)
    }

    // Eliminar carpeta
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true })
      return m.reply(`✅ Sesión eliminada del SubBot ${id}`)
    } else {
      return m.reply('⚠️ No existe sesión para ese número.')
    }
  }
}
