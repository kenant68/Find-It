import {
  getAllUsers,
  getUser,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from "../services/users.service.js";
import { uploadAvatar, uploadBanner, deleteFile, getFileUrl } from "../services/upload.service.js";
import multer from "multer";

export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserByUsernameHandler(req, res) {
  try {
    const user = await getUserByUsername(req.params.username);
    if (!user) return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserByEmailHandler(req, res) {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function createUserHandler(req, res) {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (["INVALID_PAYLOAD", "INVALID_EMAIL", "USERNAME_ALREADY_EXISTS", "EMAIL_ALREADY_EXISTS"].includes(err.message)) {
      const status = err.message === "INVALID_PAYLOAD" || err.message === "INVALID_EMAIL" ? 400 : 409;
      return res.status(status).json({ error: { message: err.message.replace(/_/g, " "), code: err.message } });
    }
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function updateUserHandler(req, res) {
  try {
    console.log(`[USERS] Update request for user ${req.params.id}:`, req.body);
    const updatedUser = await updateUser(Number(req.params.id), req.body);
    console.log(`[USERS] User updated successfully:`, updatedUser);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    if (["USER_NOT_FOUND", "INVALID_EMAIL", "USERNAME_ALREADY_EXISTS", "EMAIL_ALREADY_EXISTS"].includes(err.message)) {
      const status = err.message === "USER_NOT_FOUND" ? 404 : err.message === "INVALID_EMAIL" ? 400 : 409;
      return res.status(status).json({ error: { message: err.message.replace(/_/g, " "), code: err.message } });
    }
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    await deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function updatePasswordHandler(req, res) {
  try {
    await updateUserPassword(Number(req.params.id), req.body.passwordHash);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function uploadAvatarHandler(req, res) {
  try {
    const userId = req.user.id; // Récupéré du middleware d'authentification

    // Utiliser multer pour uploader le fichier
    uploadAvatar(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              error: { message: "Fichier trop volumineux. Taille maximale : 5MB", code: "FILE_TOO_LARGE" }
            });
          }
        }
        return res.status(400).json({
          error: { message: err.message || "Erreur lors de l'upload", code: "UPLOAD_ERROR" }
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: { message: "Aucun fichier fourni", code: "NO_FILE" }
        });
      }

      try {
        // Récupérer l'utilisateur actuel pour supprimer l'ancien avatar s'il existe
        const currentUser = await getUser(userId);
        if (currentUser.avatarUrl) {
          await deleteFile(currentUser.avatarUrl);
        }

        // Générer l'URL du nouveau fichier
        const avatarUrl = getFileUrl(req.file.filename, 'avatar');

        // Mettre à jour l'utilisateur avec la nouvelle URL
        const updatedUser = await updateUser(userId, { avatarUrl });

        res.json({
          message: "Avatar uploadé avec succès",
          avatarUrl: avatarUrl,
          user: updatedUser
        });
      } catch (updateErr) {
        // Supprimer le fichier uploadé en cas d'erreur
        await deleteFile(req.file.path);
        throw updateErr;
      }
    });
  } catch (err) {
    console.error("Erreur lors de l'upload d'avatar:", err);
    res.status(500).json({ error: { message: "Erreur interne du serveur", code: "INTERNAL_ERROR" } });
  }
}

export async function uploadBannerHandler(req, res) {
  try {
    const userId = req.user.id; // Récupéré du middleware d'authentification

    // Utiliser multer pour uploader le fichier
    uploadBanner(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              error: { message: "Fichier trop volumineux. Taille maximale : 10MB", code: "FILE_TOO_LARGE" }
            });
          }
        }
        return res.status(400).json({
          error: { message: err.message || "Erreur lors de l'upload", code: "UPLOAD_ERROR" }
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: { message: "Aucun fichier fourni", code: "NO_FILE" }
        });
      }

      try {
        // Récupérer l'utilisateur actuel pour supprimer l'ancienne bannière s'il existe
        const currentUser = await getUser(userId);
        if (currentUser.bannerUrl) {
          await deleteFile(currentUser.bannerUrl);
        }

        // Générer l'URL du nouveau fichier
        const bannerUrl = getFileUrl(req.file.filename, 'banner');

        // Mettre à jour l'utilisateur avec la nouvelle URL
        const updatedUser = await updateUser(userId, { bannerUrl });

        res.json({
          message: "Bannière uploadée avec succès",
          bannerUrl: bannerUrl,
          user: updatedUser
        });
      } catch (updateErr) {
        // Supprimer le fichier uploadé en cas d'erreur
        await deleteFile(req.file.path);
        throw updateErr;
      }
    });
  } catch (err) {
    console.error("Erreur lors de l'upload de bannière:", err);
    res.status(500).json({ error: { message: "Erreur interne du serveur", code: "INTERNAL_ERROR" } });
  }
}

export async function deleteAvatarHandler(req, res) {
  try {
    const userId = req.user.id;

    // Récupérer l'utilisateur actuel
    const currentUser = await getUser(userId);
    if (!currentUser.avatarUrl) {
      return res.status(400).json({
        error: { message: "Aucun avatar à supprimer", code: "NO_AVATAR" }
      });
    }

    // Supprimer le fichier
    await deleteFile(currentUser.avatarUrl);

    // Mettre à jour l'utilisateur
    const updatedUser = await updateUser(userId, { avatarUrl: null });

    res.json({
      message: "Avatar supprimé avec succès",
      user: updatedUser
    });
  } catch (err) {
    console.error("Erreur lors de la suppression d'avatar:", err);
    res.status(500).json({ error: { message: "Erreur interne du serveur", code: "INTERNAL_ERROR" } });
  }
}

export async function deleteBannerHandler(req, res) {
  try {
    const userId = req.user.id;

    // Récupérer l'utilisateur actuel
    const currentUser = await getUser(userId);
    if (!currentUser.bannerUrl) {
      return res.status(400).json({
        error: { message: "Aucune bannière à supprimer", code: "NO_BANNER" }
      });
    }

    // Supprimer le fichier
    await deleteFile(currentUser.bannerUrl);

    // Mettre à jour l'utilisateur
    const updatedUser = await updateUser(userId, { bannerUrl: null });

    res.json({
      message: "Bannière supprimée avec succès",
      user: updatedUser
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de bannière:", err);
    res.status(500).json({ error: { message: "Erreur interne du serveur", code: "INTERNAL_ERROR" } });
  }
}
