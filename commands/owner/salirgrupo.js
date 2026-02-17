export default {
  command: ["allleave"],
  category: "owner",
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("Pon link del grupo");

    try {
      const code = args[0]
        .split("chat.whatsapp.com/")[1]
        ?.split("?")[0];

      if (!code) return m.reply("Link inválido");

      const group = await client.groupGetInviteInfo(code);

      let salieron = 0;

      m.reply("Sacando bots del grupo...");

      // Subbots
      for (const conn of global.conns || []) {
        try {
          const meta = await conn.groupMetadata(group.id);

          const botID =
            conn.user.id.split(":")[0] + "@s.whatsapp.net";

          const inside = meta.participants.some(
            p => p.id === botID
          );

          if (!inside) continue;

          await conn.groupLeave(group.id);
          salieron++;

          await new Promise(r => setTimeout(r, 700));
        } catch {}
      }

      // Bot principal
      try {
        await client.groupLeave(group.id);
        salieron++;
      } catch {}

      if (!salieron)
        return m.reply("No hay bots en ese grupo.");

      m.reply(`✅ ${salieron} bots salieron del grupo`);
    } catch (e) {
      console.log(e);
      m.reply("Error al salir del grupo");
    }
  }
};
