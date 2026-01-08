const { VITE_API_BASE_URL, VITE_TMDB_API_KEY } = import.meta.env;

export const apiClient = async (endpoint, customConfig = {}) => {
  const config = {
    method: 'GET',
    ...customConfig,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${VITE_TMDB_API_KEY}`,
      ...customConfig.headers, // Allow overriding headers if needed
    },
  };

  const response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
