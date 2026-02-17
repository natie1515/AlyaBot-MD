export default {
  command: ["botcount"],
  category: "owner",
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("Pon el link del grupo");

    try {
      const code = args[0].split("chat.whatsapp.com/")[1];
      if (!code) return m.reply("Link inválido");

      const group = await client.groupGetInviteInfo(code);
      const participants = group.participants;

      const bots = [client, ...(global.conns || [])];
      let total = 0;

      for (let conn of bots) {
        try {
          const botID =
            conn.user.id.split(":")[0] + "@s.whatsapp.net";

          if (participants.some(p => p.id === botID))
            total++;
        } catch {}
      }

      if (total === 0) {
        return m.reply("⚠️ No hay bots dentro del grupo");
      }

      m.reply(
        `🤖 Bots en el grupo: ${total}\n👥 Miembros totales: ${participants.length}`
      );
    } catch (e) {
      m.reply("No pude obtener info del grupo");
    }
  }
};
