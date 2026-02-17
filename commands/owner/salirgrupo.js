import fs from "fs";

export default {
  command: ["allleave"],
  category: "owner",
  run: async (client, m, args) => {
    if (!args[0]) return m.reply("Pon el enlace del grupo");

    try {
      const code = args[0].split("chat.whatsapp.com/")[1];
      if (!code) return m.reply("Link inválido");

      const group = await client.groupGetInviteInfo(code);

      // Bot principal
      await client.groupLeave(group.id);

      // Sub bots
      const subs = fs.readdirSync("./Sessions/Subs");

      for (let sub of subs) {
        try {
          let conn = global.conns?.find(c =>
            c.user?.id?.includes(sub)
          );
          if (conn) await conn.groupLeave(group.id);
        } catch {}
      }

      m.reply("✅ Todos los bots salieron del grupo");
    } catch (e) {
      console.log(e);
      m.reply("Error al salir");
    }
  }
};
