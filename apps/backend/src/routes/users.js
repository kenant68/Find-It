import { Router } from "express";

const router = Router();

const users = [
  { id: 1, username: "Musashiii_" },
  { id: 2, username: "Tekba" },
  { id: 3, username: "FindItUser" }
];

router.get("/", (req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
  }

  res.json(user);
});

export default router;