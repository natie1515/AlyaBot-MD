export default {
  command: ["allleave"],
  category: "owner",
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("Pon el link del grupo");

    try {
      const code = args[0]
        .split("chat.whatsapp.com/")[1]
        ?.split("?")[0];

      if (!code) return m.reply("Link inválido");

      const group = await client.groupGetInviteInfo(code);

      m.reply("Sacando SubBots del grupo...");

      // SOLO subbots
      const bots = global.conns || [];
      let salieron = 0;

      for (let conn of bots) {
        try {
          await conn.groupLeave(group.id);
          salieron++;
          await new Promise(r => setTimeout(r, 800));
        } catch {}
      }

      if (!salieron)
        return m.reply("⚠️ No había subbots en el grupo");

      m.reply(`✅ ${salieron} SubBots salieron del grupo`);
    } catch (e) {
      console.log(e);
      m.reply("Error al salir del grupo");
    }
  }
};
