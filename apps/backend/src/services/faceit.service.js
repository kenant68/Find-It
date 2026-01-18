const FACEIT_API_BASE_URL = "https://open.faceit.com/data/v4";

async function fetchFromFaceitAPI(endpoint) {
  try {
    const apiKey = process.env.FACEIT_API_KEY || "";

    if (!apiKey || apiKey.trim() === "") {
      console.error("[FACEIT] FACEIT_API_KEY is not set or empty");
      throw new Error("FACEIT_API_KEY_NOT_SET");
    }

    const url = `${FACEIT_API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FACEIT API Error: ${response.status} ${response.statusText} - ${errorText}`);
      console.error(`FACEIT API URL: ${url}`);

      if (response.status === 404) {
        throw new Error("FACEIT_PLAYER_NOT_FOUND");
      }
      if (response.status === 401) {
        throw new Error("FACEIT_API_KEY_INVALID");
      }
      if (response.status === 403) {
        throw new Error("FACEIT_API_FORBIDDEN");
      }
      if (response.status === 429) {
        throw new Error("FACEIT_API_RATE_LIMIT");
      }
      throw new Error(`FACEIT_API_ERROR_${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.startsWith("FACEIT_")) {
      throw error;
    }
    console.error("FACEIT API fetch error:", error);
    throw new Error("FACEIT_API_UNAVAILABLE");
  }
}

async function getPlayerIdByNickname(nickname) {
  const encodedNickname = encodeURIComponent(nickname);
  console.log(`[FACEIT] Searching player: "${nickname}"`);

  try {
    const data = await fetchFromFaceitAPI(`/players/${encodedNickname}`);

    if (data.player_id) {
      return data.player_id;
    }

    console.error(`[FACEIT] No player_id found in direct endpoint response`);
    throw new Error("FACEIT_PLAYER_NOT_FOUND");
  } catch (directError) {
    if (directError.message === "FACEIT_PLAYER_NOT_FOUND" || directError.message.startsWith("FACEIT_API_ERROR")) {
      console.log(`[FACEIT] Direct endpoint failed, trying query parameter endpoint`);

      try {
        const data = await fetchFromFaceitAPI(`/players?nickname=${encodedNickname}`);

        if (data.player_id) {
          return data.player_id;
        }

        console.error(`[FACEIT] No player_id found in query endpoint response`);
        throw new Error("FACEIT_PLAYER_NOT_FOUND");
      } catch (queryError) {
        console.error(`[FACEIT] Both endpoints failed. Last error: ${queryError.message}`);
        throw new Error("FACEIT_PLAYER_NOT_FOUND");
      }
    }
    throw directError;
  }
}

function isUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

async function getRecentMatches(playerId) {
  try {
    const matchesData = await fetchFromFaceitAPI(`/players/${playerId}/history?game=cs2&limit=5`);

    if (!matchesData || !matchesData.items || matchesData.items.length === 0) {
      console.log(`[FACEIT] No matches found, trying with 'from' parameter`);

      const alternateData = await fetchFromFaceitAPI(`/players/${playerId}/history?game=cs2&from=0&limit=5`);

      if (!alternateData || !alternateData.items || alternateData.items.length === 0) {
        console.log(`[FACEIT] Still no matches found`);
        return [];
      }

      return alternateData.items.map(match => formatMatchDetails(match, playerId)).filter(m => m !== null);
    }

    return matchesData.items.map(match => formatMatchDetails(match, playerId)).filter(m => m !== null);
  } catch (error) {
    console.error(`[FACEIT] Failed to fetch recent matches: ${error.message}`);
    console.error(`[FACEIT] Error stack:`, error.stack);
    return [];
  }
}

function formatMatchDetails(match, playerId) {
  try {
    if (!match.teams || !match.teams.faction1 || !match.teams.faction2 || !match.results) {
      console.log(`[FACEIT] Match missing required data`);
      return null;
    }

    const inFaction1 = match.teams.faction1.roster?.some(p => p.player_id === playerId);
    const inFaction2 = match.teams.faction2.roster?.some(p => p.player_id === playerId);

    if (!inFaction1 && !inFaction2) {
      console.log(`[FACEIT] Player ${playerId} not found in match ${match.match_id} rosters`);
      return null;
    }

    const playerFaction = inFaction1 ? 'faction1' : 'faction2';
    const opponentFaction = inFaction1 ? 'faction2' : 'faction1';

    const playerTeam = match.teams[playerFaction];
    const opponentTeam = match.teams[opponentFaction];

    const won = match.results.winner === playerFaction;

    const playerScore = match.results.score?.[playerFaction] || 0;
    const opponentScore = match.results.score?.[opponentFaction] || 0;

    return {
      matchId: match.match_id,
      playedAt: match.finished_at ? new Date(match.finished_at * 1000).toISOString() : new Date().toISOString(),
      map: match.voting?.map?.pick?.[0] || match.map || null,
      result: won ? 'win' : 'loss',
      score: `${playerScore}-${opponentScore}`,
      playerScore: playerScore,
      opponentScore: opponentScore,
      playerTeam: {
        name: playerTeam.name || 'Unknown',
        score: playerScore
      },
      opponentTeam: {
        name: opponentTeam.name || 'Unknown',
        score: opponentScore
      },
      eloChange: match.elo ? (won ? `+${match.elo[playerFaction]}` : match.elo[playerFaction]) : null,
      matchUrl: `https://www.faceit.com/en/cs2/room/${match.match_id}`
    };
  } catch (error) {
    console.error(`[FACEIT] Error formatting match details:`, error);
    return null;
  }
}

function parseNumericStat(value) {
  if (!value) return 0;

  const strValue = String(value).replace(/,/g, '');
  const numValue = parseFloat(strValue);

  return isNaN(numValue) ? 0 : numValue;
}

function calculateFavoriteMap(statsData) {
  try {
    const segments = statsData?.segments;

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      console.log(`[FACEIT] No segments data available for favorite map calculation`);
      return { favMap: null, favMapWinRate: null };
    }

    let bestMap = null;
    let bestWinRate = 0;
    let mostPlayedMap = null;
    let mostMatches = 0;

    segments.forEach(segment => {
      const mapLabel = segment.label || segment.img_regular || segment.mode;
      const segmentStats = segment.stats || {};

      const mapMatches = parseInt(segmentStats.Matches || segmentStats.matches || "0", 10);
      const mapWins = parseInt(segmentStats.Wins || segmentStats.wins || "0", 10);
      const mapWinRate = mapMatches > 0 ? (mapWins / mapMatches) * 100 : 0;

      if (mapMatches > mostMatches) {
        mostMatches = mapMatches;
        mostPlayedMap = { map: mapLabel, winRate: mapWinRate };
      }

      if (mapMatches >= 3 && mapWinRate > bestWinRate) {
        bestWinRate = mapWinRate;
        bestMap = { map: mapLabel, winRate: mapWinRate };
      }
    });

    const result = bestMap || mostPlayedMap;

    if (result) {
      return {
        favMap: result.map,
        favMapWinRate: result.winRate.toFixed(2) + "%"
      };
    }

    return { favMap: null, favMapWinRate: null };
  } catch (error) {
    console.error(`[FACEIT] Error calculating favorite map:`, error);
    return { favMap: null, favMapWinRate: null };
  }
}

async function calculateWinstreak(playerId) {
  try {
    const matchesData = await fetchFromFaceitAPI(`/players/${playerId}/history?game=cs2&limit=20`);

    if (!matchesData || !matchesData.items || matchesData.items.length === 0) {
      return 0;
    }

    let currentStreak = 0;
    let lastResult = null;

    for (const match of matchesData.items) {
      if (!match.teams || !match.results) continue;

      const inFaction1 = match.teams.faction1.roster?.some(p => p.player_id === playerId);
      const playerTeam = inFaction1 ? 'faction1' : 'faction2';
      const won = match.results.winner === playerTeam;

      if (lastResult === null) {
        lastResult = won;
        currentStreak = won ? 1 : -1;
      } else if (won === lastResult) {
        currentStreak = won ? currentStreak + 1 : currentStreak - 1;
      } else {
        break;
      }
    }

    return currentStreak;
  } catch (error) {
    console.error(`[FACEIT] Error calculating winstreak:`, error);
    return 0;
  }
}

async function formatFaceitStats(playerData, statsData, userId) {
  const cs2Game = playerData?.games?.cs2 || playerData?.games?.csgo || {};
  const lifetime = statsData?.lifetime || {};

  const matches = parseInt(lifetime.Matches || "0", 10);
  const wins = parseInt(lifetime.Wins || "0", 10);
  const winRate = lifetime["Win Rate %"] || (matches > 0 ? ((wins / matches) * 100).toFixed(2) + "%" : "0%");

  const headshotPercent = lifetime["Headshot %"] || (lifetime["Average Headshots %"] || null);

  const kdRatioFromAPI = lifetime["Average K/D Ratio"] || lifetime["K/D Ratio"];
  let kdRatio = null;

  if (kdRatioFromAPI) {
    kdRatio = parseNumericStat(kdRatioFromAPI).toFixed(2);
  } else {
    const kills = parseNumericStat(lifetime["Total Kills"] || lifetime["Kills"]);
    const deaths = parseNumericStat(lifetime["Total Deaths"] || lifetime["Deaths"]);

    if (deaths > 0) {
      kdRatio = (kills / deaths).toFixed(2);
    }
  }

  const recentMatches = await getRecentMatches(playerData.player_id);
  const { favMap, favMapWinRate } = calculateFavoriteMap(statsData);
  const winstreak = await calculateWinstreak(playerData.player_id);

  return {
    user_id: userId,
    elo: cs2Game.faceit_elo || 0,
    matches_played: matches,
    wins: wins,
    win_rate: typeof winRate === "string" ? winRate : winRate + "%",
    winstreak: winstreak,
    recent_matches: recentMatches,
    average_headshots: headshotPercent ? (typeof headshotPercent === "string" ? headshotPercent : headshotPercent + "%") : null,
    average_K_D: kdRatio,
    fav_map: favMap,
    fav_map_win_rate: favMapWinRate,
    last_update: new Date().toISOString()
  };
}

export async function getFaceitStatsByPlayerId(faceitPlayerIdOrNickname) {
  if (!faceitPlayerIdOrNickname) {
    throw new Error("FACEIT_PLAYER_ID_REQUIRED");
  }

  let playerId = faceitPlayerIdOrNickname;

  if (!isUUID(faceitPlayerIdOrNickname)) {
    playerId = await getPlayerIdByNickname(faceitPlayerIdOrNickname);
  }

  const playerData = await fetchFromFaceitAPI(`/players/${playerId}`);
  const statsData = await fetchFromFaceitAPI(`/players/${playerId}/stats/cs2`)
    .catch(() => fetchFromFaceitAPI(`/players/${playerId}/stats/csgo`).catch(() => ({})));

  return await formatFaceitStats(playerData, statsData, null);
}

export async function getFaceitStatsByUserId(userId, faceitIdOrNickname) {
  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  if (!faceitIdOrNickname) {
    throw new Error("FACEIT_ID_REQUIRED");
  }

  let playerId = faceitIdOrNickname;

  if (!isUUID(faceitIdOrNickname)) {
    playerId = await getPlayerIdByNickname(faceitIdOrNickname);
  }

  const playerData = await fetchFromFaceitAPI(`/players/${playerId}`);
  const statsData = await fetchFromFaceitAPI(`/players/${playerId}/stats/cs2`)
    .catch(() => fetchFromFaceitAPI(`/players/${playerId}/stats/csgo`).catch(() => ({})));

  return await formatFaceitStats(playerData, statsData, userId);
}
