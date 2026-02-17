export default {
  command: ["allleave"],
  category: "owner",
  run: async (client, m, { args }) => {
    if (!args[0]) return m.reply("⚠️ Por favor, proporciona el link del grupo.");

    try {
      // Extraer el código de invitación de forma más segura
      const inviteCode = args[0].split("chat.whatsapp.com/")[1]?.split(" ")[0];
      if (!inviteCode) return m.reply("❌ Link inválido.");

      // Obtener ID del grupo mediante el código
      const groupData = await client.groupGetInviteInfo(inviteCode);
      const groupId = groupData.id;

      m.reply("🚀 Iniciando salida masiva de bots...");

      // Lista de todas las conexiones (principal + sub-bots)
      const bots = [client, ...(global.conns || [])];
      let successCount = 0;

      for (const conn of bots) {
        try {
          // Intentar salir del grupo
          await conn.groupLeave(groupId);
          successCount++;
          
          // Pequeño delay para evitar saturación/baneos
          await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
          // Si falla (ej. el bot no estaba en el grupo), se ignora silenciosamente
          continue;
        }
      }

      if (successCount === 0) {
        return m.reply("ℹ️ Ningún bot estaba en ese grupo o ya habían salido.");
      }

      m.reply(`✅ Operación finalizada. **${successCount}** bots salieron del grupo correctamente.`);
      
    } catch (e) {
      console.error(e);
      m.reply("❌ Error: No se pudo obtener información del grupo. Asegúrate de que el link sea válido.");
    }
  }
};
