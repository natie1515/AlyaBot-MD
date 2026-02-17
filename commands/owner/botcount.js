export default {
  command: ["botcount"],
  category: "owner",
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("Pon el link del grupo");

    try {
      const code = args[0].split("chat.whatsapp.com/")[1];
      if (!code) return m.reply("Link inválido");

      const group = await client.groupGetInviteInfo(code);

      const bots = [client, ...(global.conns || [])];
      let total = 0;

      for (let conn of bots) {
        try {
          const metadata = await conn.groupMetadata(group.id);
          const botID =
            conn.user.id.split(":")[0] + "@s.whatsapp.net";

          const esta = metadata.participants.some(
            p => p.id === botID
          );

          if (esta) total++;
        } catch {}
      }

      if (!total)
        return m.reply("⚠️ No hay bots en ese grupo");

      m.reply(`🤖 Bots en el grupo: ${total}`);
    } catch (e) {
      m.reply("No pude obtener info del grupo");
    }
  }
};
