const users = [
  { id: 1, username: "Musashiii_" },
  { id: 2, username: "Tekba" }
];

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((user) => user.id === id) || null;
}

export function findByUsername(username) {
  return users.find((user) => user.username === username) || null;
}

export function addUser(userData) {
  const newUser = {
    id: users.length + 1,
    ...userData
  };
  users.push(newUser);
  return newUser;
}