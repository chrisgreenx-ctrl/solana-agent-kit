# Solana Agent Kit GUI

A complete GUI suite that leverages all functionality from the Solana Agent Kit v2, available as both a web app and mobile app.

## Overview

This project provides modern interfaces for interacting with the Solana blockchain through the Solana Agent Kit. It includes an AI-powered chat interface and dedicated panels for token and NFT operations.

## Architecture

### Mobile App (Expo React Native)
- **Location**: `mobile/`
- **Port**: 5000 (web preview)
- **Tech Stack**: Expo SDK 52, React Native, React Navigation, TypeScript
- **Run**: `npm run dev:mobile`

### Web Frontend (React + Vite)
- **Location**: `client/`
- **Port**: 5000
- **Tech Stack**: React 19, TypeScript, TanStack Query, Lucide Icons
- **Run**: `npm run dev`

### Backend (Express + Solana Agent Kit)
- **Location**: `server/`
- **Port**: 3001
- **Tech Stack**: Express, Solana Agent Kit v2, OpenRouter API

## Features

### Token Operations (Token Plugin)
- Get wallet balance
- Transfer SOL/tokens
- Swap tokens via Jupiter
- Fetch token prices
- Token security analysis (Rugcheck)
- Pyth oracle price feeds
- Request faucet funds
- Get network TPS

### NFT Operations (NFT Plugin)
- Deploy NFT collections
- Mint NFTs to collections
- List NFTs for sale (Tensor)
- Search assets by creator
- Get assets by authority

### AI Chat
- Natural language blockchain operations
- Streaming responses
- Session persistence
- All toolkit actions available

## Environment Variables (Optional)

These can be set via environment variables OR through the in-app Settings page:

```
OPENROUTER_API_KEY=your_openrouter_api_key
RPC_URL=your_solana_rpc_url
SOLANA_PRIVATE_KEY=your_base58_encoded_private_key
```

**Note**: The Settings page allows users to configure API keys and select AI models dynamically without environment variables.

## Project Structure

```
/
├── mobile/                 # Expo React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   ├── TokensScreen.tsx
│   │   │   ├── NFTsScreen.tsx
│   │   │   ├── ToolsScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── services/
│   │   │   └── api.ts     # API service layer
│   │   └── theme.ts       # Colors and spacing
│   ├── App.tsx            # Main app with navigation
│   ├── app.json           # Expo configuration
│   └── package.json       # Mobile dependencies
├── client/                 # React web frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
├── server/
│   └── index.ts           # Express API server
├── package.json           # Root package config
└── replit.md             # This file
```

## API Endpoints

- `GET /api/status` - Check agent configuration status
- `GET /api/config` - Get current configuration status (booleans only)
- `POST /api/config` - Update runtime configuration
- `GET /api/models` - Fetch available AI models from OpenRouter
- `GET /api/wallet` - Get wallet address and balance
- `GET /api/actions` - List all available actions
- `POST /api/chat` - AI chat with streaming responses
- `POST /api/execute-action` - Execute specific action directly

## Running the Project

### Mobile App (Current Default)
```bash
npm run dev:mobile
```
Starts the Expo mobile app on port 5000 with the backend on port 3001.

### Web App
```bash
npm run dev
```
Starts the React web frontend on port 5000 with the backend on port 3001.

## Mobile App Configuration

The mobile app uses environment variables for API configuration:
- `EXPO_PUBLIC_API_URL`: Backend API URL (set in `mobile/.env`)

## User Preferences

- Dark theme with purple/green accent colors (Solana branding)
- Responsive design for all screen sizes
- Minimal loading states with spinners
- Bottom tab navigation in mobile app

## Known Limitations

### Plugin Compatibility
The DeFi, Misc, and Blinks plugins from Solana Agent Kit have compatibility issues with the current Node.js 22 + ESM environment:
- **Issue**: `@coral-xyz/anchor` package doesn't export `BN` correctly in ESM context
- **Affected**: `@solana-agent-kit/plugin-defi`, `@solana-agent-kit/plugin-misc`, `@solana-agent-kit/plugin-blinks`
- **Root cause**: Transitive dependencies (`@meteora-ag/dlmm`, etc.) expect BN export from anchor
- **Workaround**: Currently using Token and NFT plugins only. DeFi/Misc/Blinks features are accessible via AI Chat natural language commands.

### Active Plugins
- Token Plugin: Full functionality for token operations
- NFT Plugin: Full functionality for NFT operations

## Mobile App Screens

The mobile app includes 4 main tabs:
1. **Dashboard** - Overview and status
2. **AI Chat** - Natural language blockchain operations
3. **Actions** - Action Center with 5 categories (Tokens, NFTs, DeFi, Utilities, Blinks)
4. **Settings** - API configuration

### Additional Screens (via Actions tab)
- ActionCenterScreen.tsx - Unified hub for all categories
- DeFiScreen.tsx - DeFi features (guidance to use AI Chat)
- MiscScreen.tsx - Utilities (prices, domains, airdrops)
- BlinksScreen.tsx - Games and blinks
