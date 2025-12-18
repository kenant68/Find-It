const teams = [
  { id: 1, name: "team_xantares", region: "Europe", eloAvg: 1500 },
  { id: 2, name: "team_s1mple", region: "Europe", eloAvg: 1600 },
  { id: 3, name: "team_ropz", region: "Europe", eloAvg: 1550 }
];

let nextId = teams.length > 0 ? Math.max(...teams.map((team) => team.id)) + 1 : 1;

export function findAll() {
  return teams;
}

export function findById(id) {
  return teams.find((team) => team.id === id) || null;
}

export function findByName(name) {
  const normalized = name.trim().toLowerCase();
  return teams.find((team) => team.name === normalized) || null;
}

export function addTeam({ name, region, eloAvg }) {
  const newTeam = {
    id: nextId++,
    name,
    region,
    eloAvg
  };
  teams.push(newTeam);
  return newTeam;
}