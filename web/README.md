# Vyne Web

The `web` app is the browser dashboard for Vyne. It lets you paste AI-generated Python code, run a scan against the local API, and review findings in a fast visual workflow.

## Local development
```bash
npm install
npm run dev
```

Open `http://localhost:3000` after starting the dashboard.

## API dependency
The dashboard expects the Vyne API to be available at `http://localhost:8000/api/v1/scan`.
