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
      const bots = global.conns || [];

      m.reply("Sacando SubBots del grupo...");

      let salieron = 0;

      for (let conn of bots) {
        try {
          const meta = await conn.groupMetadata(group.id);
          const botID =
            conn.user.id.split(":")[0] + "@s.whatsapp.net";

          const esta = meta.participants.some(
            p => p.id === botID
          );

          if (esta) {
            await conn.groupLeave(group.id);
            salieron++;
            await new Promise(r => setTimeout(r, 800));
          }
        } catch {}
      }

      if (!salieron)
        return m.reply("⚠️ No hay SubBots en el grupo");

      m.reply(`✅ ${salieron} SubBots salieron del grupo`);
    } catch (e) {
      console.log(e);
      m.reply("Error al salir del grupo");
    }
  }
};
