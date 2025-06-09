// Development configuration settings
export const devConfig = {
  // Toggle for development scenario features
  dev_scenario: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEV_SCENARIO === 'true',
  
  // Other dev settings can be added here
  showDebugInfo: process.env.NODE_ENV === 'development',
  enableTestRoutes: process.env.NODE_ENV === 'development',
};

export default devConfig;
