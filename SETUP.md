# Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Todo API server running

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todowka-webclient
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` if needed (default API URL is http://localhost:8000).

## Running the Todo API

The Todo API server must be running. From the API project:

```bash
# Using Python/uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using the provided script
./run_api.sh
```

## Development

Start the development server:

```bash
npm run dev
```

Visit http://localhost:3000

## Troubleshooting

### API Connection Issues

- Verify the Todo API is running: `curl http://localhost:8000/api/v1/health`
- Check the API URL in `.env.local`
- Check the CORS settings on the API server

### Build Errors

- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear the Next.js cache: `rm -rf .next`
