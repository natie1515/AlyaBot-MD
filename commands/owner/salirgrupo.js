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

      m.reply("Sacando bots del grupo...");

      const bots = [client, ...(global.conns || [])];

      for (let i = 0; i < bots.length; i++) {
        const conn = bots[i];

        try {
          await conn.groupLeave(group.id);
        } catch {}

        await new Promise(r => setTimeout(r, 800));
      }

      m.reply(`✅ ${bots.length} bots salieron del grupo`);
    } catch (e) {
      console.log(e);
      m.reply("Error al salir del grupo");
    }
  }
};
