// Dynamic API Configuration
// This file automatically determines the API base URL based on the environment

const API_CONFIG = (() => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const configuredApiBaseUrl = window.PIXEL_LOOT_API_BASE_URL;
  
// Determine API base URL based on environment
  let apiBaseUrl;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // 1. 如果你在本機自己電腦開前端測試，依然可以連到 Railway 的雲端後端
    apiBaseUrl = 'https://pixel-loot-backend-production.up.railway.app/api';
  } else {
    // 2. 如果前端也部署到網路上（例如 GitHub Pages 或 Vercel），也一律連到 Railway 雲端後端
    apiBaseUrl = 'https://pixel-loot-backend-production.up.railway.app/api';
  }
  
  return {
    apiBaseUrl,
    isDevelopment: hostname === 'localhost' || hostname === '127.0.0.1',
    hostname,
  };
})();

console.log(`[Config] API Base URL: ${API_CONFIG.apiBaseUrl} (${API_CONFIG.isDevelopment ? 'Development' : 'Production'})`);
