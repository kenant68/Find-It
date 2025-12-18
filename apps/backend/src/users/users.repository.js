const users = [
  { id: 1, username: "musashiii_", email: "musashiii@example.com", region: "Europe" },
  { id: 2, username: "tekbas", email: "tekbas@example.com", region: "Europe" },
  { id: 3, username: "w0xic", email: "w0xic@example.com", region: "Europe" },
  { id: 4, username: "r0pz", email: "r0pz@example.com", region: "Europe" },
  { id: 5, username: "f0rsaken", email: "f0rsaken@example.com", region: "Europe" }
];

let nextId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((user) => user.id === id) || null;
}

export function findByUsername(username) {
  const normalized = username.trim().toLowerCase();
  return users.find((user) => user.username === normalized) || null;
}

export function findByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email === normalized) || null;
}

export function addUser({ username, email, region }) {
  const newUser = {
    id: nextId++,
    username,
    email,
    region
  };
  users.push(newUser);
  return newUser;
}