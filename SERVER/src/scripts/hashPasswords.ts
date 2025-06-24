import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.model";

const hashPasswords = async () => {
  try {
    const users = await Usuario.findAll();

    for (const user of users) {
      const password = user.get("password") as string;
      if (password && !password.startsWith("$2b$")) { // Validar que el campo password no sea undefined
        const hashedPassword = await bcrypt.hash(password, 10);
        user.set("password", hashedPassword);
        await user.save();
        console.log(`Contraseña actualizada para el usuario con email: ${user.get("email")}`);
      }
    }

    console.log("Todas las contraseñas han sido actualizadas correctamente.");
  } catch (error) {
    console.error("Error al actualizar las contraseñas:", error);
  }
};

hashPasswords();
