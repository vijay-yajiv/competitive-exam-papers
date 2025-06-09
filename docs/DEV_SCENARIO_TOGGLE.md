# Dev Scenario Toggle Documentation

## Overview
The `dev_scenario` toggle controls the visibility of development-only features in the application, specifically the Admin Dashboard links.

## Configuration

### Location
The configuration is managed in `/src/config/devConfig.ts`

### Default Behavior
- **Development Environment** (`NODE_ENV === 'development'`): Admin links are **enabled** by default
- **Production Environment** (`NODE_ENV === 'production'`): Admin links are **disabled** by default

### Manual Override
You can manually control the toggle using the environment variable:

```bash
NEXT_PUBLIC_DEV_SCENARIO=true   # Force enable admin links
NEXT_PUBLIC_DEV_SCENARIO=false  # Force disable admin links
```

## Features Controlled by dev_scenario

### 1. Home Page Admin Dashboard Button
- **Location**: Hero section of the home page (`/`)
- **Appearance**: Red button with 🔧 icon labeled "Admin Dashboard"
- **Behavior**: Only visible when `dev_scenario` is `true`

### 2. Navbar Profile Menu Admin Link
- **Location**: User profile dropdown menu
- **Appearance**: Red text with 🔧 icon and border separator
- **Behavior**: Only visible when user is authenticated AND `dev_scenario` is `true`

### 3. Mobile Menu Admin Link
- **Location**: Mobile navigation menu
- **Appearance**: Red text with 🔧 icon
- **Behavior**: Only visible when user is authenticated AND `dev_scenario` is `true`

## Usage Examples

### Enable for Development
```bash
# .env.local
NEXT_PUBLIC_DEV_SCENARIO=true
```

### Disable for Production
```bash
# .env.production
NEXT_PUBLIC_DEV_SCENARIO=false
```

### Automatic Detection
If no environment variable is set, the toggle will automatically:
- Enable in development (`npm run dev`)
- Disable in production builds (`npm run build`)

## Testing

1. **Test Enabled State**: Start development server and verify admin links appear
2. **Test Disabled State**: Set `NEXT_PUBLIC_DEV_SCENARIO=false` and restart server
3. **Test Authentication**: Verify admin links only appear for authenticated users

## Security Note
The admin dashboard itself should have its own authentication and authorization checks. This toggle only controls the visibility of navigation links, not access to admin functionality.
