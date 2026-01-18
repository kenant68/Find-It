const API_BASE = 'http://localhost:4000/api';

const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
        throw error;
    }
};

export const login = async (email, password) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const register = async (userData) => {
    return apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const forgotPassword = async (email) => {
    return apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
};

export const resetPassword = async (token, password) => {
    return apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    });
};

export const getUsers = async () => {
    return apiRequest('/users');
};

export const getUserById = async (id) => {
    return apiRequest(`/users/${id}`);
};

export const updateUser = async (id, userData) => {
    return apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = async (id) => {
    return apiRequest(`/users/${id}`, {
        method: 'DELETE',
    });
};

export const updateUserPassword = async (id, password) => {
    return apiRequest(`/users/${id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ password }),
    });
};

export const getTeams = async () => {
    return apiRequest('/teams');
};

export const getTeamById = async (id) => {
    return apiRequest(`/teams/${id}`);
};

export const createTeam = async (teamData) => {
    return apiRequest('/teams', {
        method: 'POST',
        body: JSON.stringify(teamData),
    });
};

export const updateTeam = async (id, teamData) => {
    return apiRequest(`/teams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(teamData),
    });
};

export const deleteTeam = async (id) => {
    return apiRequest(`/teams/${id}`, {
        method: 'DELETE',
    });
};

export const getTeamMembers = async (id) => {
    return apiRequest(`/teams/${id}/members`);
};

export const getTeamScrims = async (id) => {
    return apiRequest(`/teams/${id}/scrims`);
};

export const getScrims = async () => {
    return apiRequest('/scrims');
};

export const getScrimById = async (id) => {
    return apiRequest(`/scrims/${id}`);
};

export const createScrim = async (scrimData) => {
    return apiRequest('/scrims', {
        method: 'POST',
        body: JSON.stringify(scrimData),
    });
};

export const updateScrim = async (id, scrimData) => {
    return apiRequest(`/scrims/${id}`, {
        method: 'PUT',
        body: JSON.stringify(scrimData),
    });
};

export const deleteScrim = async (id) => {
    return apiRequest(`/scrims/${id}`, {
        method: 'DELETE',
    });
};

export const getScrimsByStatus = async (status) => {
    return apiRequest(`/scrims/status/${status}`);
};

export const getMatches = async () => {
    return apiRequest('/matches');
};

export const getMatchById = async (id) => {
    return apiRequest(`/matches/${id}`);
};

export const getMaps = async () => {
    return apiRequest('/maps');
};

export const getMapById = async (id) => {
    return apiRequest(`/maps/${id}`);
};

export const getFaceitStats = async (userId) => {
    return apiRequest(`/faceit-matches/${userId}`);
};

export const getRecentFaceitMatches = async (userId) => {
    return apiRequest(`/faceit-matches/${userId}/recent-matches`);
};

export const getNotifications = async () => {
    return apiRequest('/notifications');
};

export const markNotificationAsRead = async (id) => {
    return apiRequest(`/notifications/${id}/read`, {
        method: 'PUT',
    });
};


export const getTeamWithMembers = async (id) => {
    return apiRequest(`/teams/${id}/members`);
};

export const getTeamByName = async (name) => {
    return apiRequest(`/teams/name/${name}`);
};

export const getScrimsByTeam = async (teamId) => {
    return apiRequest(`/teams/${teamId}/scrims`);
};