#!/data/data/com.termux/files/usr/bin/bash

# Import completo base
full_import='import { getUser, updateUser, getChat, updateChat, getChatUser, updateChatUser, getSettings, updateSettings, getStickersPack, updateStickersPack, deletedb, setCreate } from "#database"'

# Lista de funciones
imports="getUser updateUser getChat updateChat getChatUser updateChatUser getSettings updateSettings getStickersPack updateStickersPack deletedb setCreate"

# Recorrer todos los archivos .ts y .js
find . -type f \( -name "*.ts" -o -name "*.js" \) | while read file; do
  # Si ya hay un import de #database, reemplazarlo por el completo
  if grep -q "from \"#database\"" "$file"; then
    sed -i "s|import {[^}]*} from \"#database\"|$full_import|" "$file"
  else
    # Si no existe, añadirlo al inicio del archivo
    sed -i "1i $full_import" "$file"
  fi

  # Ahora limpiar funciones no usadas
  newimports=""
  for fn in $imports; do
    if grep -q "$fn" "$file"; then
      newimports="$newimports, $fn"
    fi
  done

  if [ -n "$newimports" ]; then
    sed -i "s|import {[^}]*} from \"#database\"|import {${newimports#, }} from \"#database\"|" "$file"
  else
    sed -i "/import {[^}]*} from \"#database\"/d" "$file"
  fi
done
