export const config = {
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? '/api/v1'
        : 'http://localhost:8000/api/v1',
    APP_NAME: 'ProphetPlay',
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
    ENDPOINTS: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
        },
        predictions: {
            create: '/predictions',
            list: '/predictions',
            detail: (id: string) => `/predictions/${id}`,
        },
        teams: {
            list: '/teams',
            detail: (id: string) => `/teams/${id}`,
            players: (id: string) => `/teams/${id}/players`,
        },
        matches: {
            upcoming: '/matches/upcoming',
            recent: '/matches/recent',
            detail: (id: string) => `/matches/${id}`,
        },
        weather: {
            current: '/weather/current',
            forecast: '/weather/forecast',
        },
    },
}; 