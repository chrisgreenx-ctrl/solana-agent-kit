# Solana Agent Kit GUI - Agent Instructions

## Project Overview

This is a complete GUI suite for the Solana Agent Kit v2, providing both a mobile app (Expo/React Native) and web interface for blockchain operations.

## Tech Stack

### Mobile App (Primary)
- **Framework**: Expo SDK 52 with React Native
- **Navigation**: React Navigation (native-stack)
- **Location**: `mobile/`
- **Entry**: `mobile/App.tsx`

### Backend
- **Framework**: Express.js with TypeScript
- **AI Integration**: Vercel AI SDK with OpenRouter
- **Blockchain**: Solana Agent Kit v2 with plugins
- **Location**: `server/`
- **Entry**: `server/index.ts`

### Web Frontend (Alternative)
- **Framework**: React 19 with Vite
- **Location**: `client/`

## Architecture

```
/
├── mobile/                 # Expo React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   ├── services/      # API service layer
│   │   └── theme.ts       # Colors and spacing
│   ├── App.tsx            # Main app with navigation
│   └── package.json
├── client/                 # React web frontend
│   ├── src/
│   └── vite.config.ts
├── server/
│   └── index.ts           # Express API server
├── scripts/
│   └── patch-anchor.mjs   # ESM compatibility patch
└── package.json           # Root package config
```

## Key Files

- `server/index.ts` - Backend API with Solana Agent Kit integration
- `mobile/App.tsx` - Mobile app entry with navigation setup
- `mobile/src/screens/*.tsx` - Individual screen components
- `mobile/src/services/api.ts` - API client for backend communication
- `mobile/src/theme.ts` - Design tokens (colors, spacing)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Check agent configuration status |
| `/api/config` | GET/POST | Get/update runtime configuration |
| `/api/models` | GET | Fetch available AI models from OpenRouter |
| `/api/wallet` | GET | Get wallet address and balance |
| `/api/actions` | GET | List all available actions |
| `/api/actions/categories` | GET | Get actions grouped by category |
| `/api/chat` | POST | AI chat with streaming responses |
| `/api/execute-action` | POST | Execute specific action directly |

## Solana Agent Kit Plugins

Currently active plugins:
- **TokenPlugin**: Token operations (transfer, deploy, balance, swap)
- **NFTPlugin**: NFT operations (deploy, mint, list on Tensor)

Plugins with ESM compatibility issues (imported but may fail at runtime):
- **DeFiPlugin**: Staking, lending, liquidity pools
- **MiscPlugin**: Airdrops, domains, price feeds
- **BlinksPlugin**: Solana Actions/Blinks

## Known Issues

### Plugin ESM/CJS Compatibility
The DeFi, Misc, and Blinks plugins have compatibility issues with Node.js 22 ESM:
- **Root cause**: `@coral-xyz/anchor` package doesn't properly export `BN` for ESM
- **Affected packages**: `@meteora-ag/dlmm` and other DeFi dependencies
- **Current workaround**: `scripts/patch-anchor.mjs` attempts to fix exports
- **Fallback**: Users can access DeFi features via AI Chat natural language

## Development Commands

```bash
# Start mobile app with backend
npm run dev:mobile

# Start web app with backend
npm run dev

# Run backend only
npm run server
```

## Environment Variables

Required secrets (configured via Settings screen or environment):
- `OPENROUTER_API_KEY` - OpenRouter API key for AI
- `RPC_URL` - Solana RPC endpoint URL
- `SOLANA_PRIVATE_KEY` - Base58-encoded wallet private key

## Code Conventions

- TypeScript for all code
- ESM modules (package.json has `"type": "module"`)
- Functional components with hooks in React/React Native
- Dark theme with purple/green accent colors (Solana branding)
- Bottom tab navigation in mobile app

## When Making Changes

1. Backend changes go in `server/index.ts`
2. Mobile UI changes go in `mobile/src/screens/`
3. API client changes go in `mobile/src/services/api.ts`
4. Always test with `npm run dev:mobile`
5. Backend runs on port 3001, mobile web preview on port 5000
