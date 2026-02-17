export default {
  command: ["allleave"],
  category: "owner",
  run: async (client, m, { args }) => {
    if (!args[0]) return m.reply("⚠️ Pasa el link del grupo.");

    try {
      // Limpieza profunda del link para evitar el 'fetch failed'
      let inviteCode = args[0].split("chat.whatsapp.com/")[1];
      if (inviteCode.includes("?")) {
        inviteCode = inviteCode.split("?")[0]; // Elimina el ?mode=gi_t y otros parámetros
      }
      inviteCode = inviteCode.trim();

      if (!inviteCode) return m.reply("❌ El link no parece ser de WhatsApp.");

      // Obtenemos los datos del grupo (aquí es donde daba el TypeError)
      const groupData = await client.groupGetInviteInfo(inviteCode).catch(e => {
         throw new Error("No se pudo obtener info del grupo. ¿El link es válido?");
      });
      
      const groupId = groupData.id;
      const bots = [client, ...(global.conns || [])];
      let successCount = 0;

      m.reply(`🔄 Intentando sacar ${bots.length} bots de: ${groupData.subject}...`);

      for (const conn of bots) {
        try {
          // Solo intentamos si la conexión está abierta
          if (conn.ws.readyState === 1) { 
            await conn.groupLeave(groupId);
            successCount++;
          }
        } catch {
          // Si no está en el grupo o falla, saltamos al siguiente
          continue;
        }
        await new Promise(r => setTimeout(r, 1000)); // Delay para evitar baneo
      }

      m.reply(`✅ Proceso terminado. Salieron **${successCount}** bots.`);

    } catch (e) {
      console.error(e);
      m.reply(`❌ Error crítico: ${e.message || e}`);
    }
  }
};
