export default {
  command: ["allleave"],
  category: "owner",
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("Pon el link del grupo");

    try {
      // Limpia el enlace
      const link = args[0].trim();
      const code = link.split("chat.whatsapp.com/")[1]?.split("?")[0];

      if (!code) return m.reply("Link inválido");

      const group = await client.groupGetInviteInfo(code);

      m.reply("Sacando bots del grupo...");

      const bots = [client, ...(global.conns || [])];
      let salieron = 0;

      for (let conn of bots) {
        try {
          await conn.groupLeave(group.id);
          salieron++;
          await new Promise(r => setTimeout(r, 800));
        } catch {}
      }

      if (!salieron)
        return m.reply("⚠️ Ningún bot estaba en el grupo");

      m.reply(`✅ ${salieron} bots salieron del grupo`);
    } catch (e) {
      console.log(e);
      m.reply("Error al salir del grupo");
    }
  }
};
