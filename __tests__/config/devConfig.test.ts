/**
 * Test for dev_scenario toggle functionality
 */

describe('Dev Scenario Toggle', () => {
  beforeEach(() => {
    // Reset environment variables
    delete process.env.NODE_ENV;
    delete process.env.NEXT_PUBLIC_DEV_SCENARIO;
    jest.resetModules();
  });

  test('should enable dev_scenario in development environment by default', () => {
    // Simulate development environment
    process.env.NODE_ENV = 'development';
    
    // Re-import to get fresh config
    const devConfig = require('@/config/devConfig').default;
    
    expect(devConfig.dev_scenario).toBe(true);
  });

  test('should disable dev_scenario in production environment by default', () => {
    // Simulate production environment
    process.env.NODE_ENV = 'production';
    
    // Re-import to get fresh config
    const devConfig = require('@/config/devConfig').default;
    
    expect(devConfig.dev_scenario).toBe(false);
  });

  test('should respect NEXT_PUBLIC_DEV_SCENARIO when set to true', () => {
    process.env.NODE_ENV = 'production'; // Even in production
    process.env.NEXT_PUBLIC_DEV_SCENARIO = 'true';
    
    // Re-import to get fresh config
    const devConfig = require('@/config/devConfig').default;
    
    expect(devConfig.dev_scenario).toBe(true);
  });

  test('should have basic configuration structure', () => {
    const devConfig = require('@/config/devConfig').default;
    
    expect(devConfig).toBeDefined();
    expect(typeof devConfig.dev_scenario).toBe('boolean');
    expect(typeof devConfig.showDebugInfo).toBe('boolean');
    expect(typeof devConfig.enableTestRoutes).toBe('boolean');
  });
});
