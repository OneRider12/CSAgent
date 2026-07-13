# CSAgent Chat API

The Agent Chat API is a FastAPI service that calls Supabase with the requesting Member's bearer token. It never accepts the static prototype's temporary login bypass.

## Run locally

```powershell
python -m pip install -r backend/requirements.txt
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_ANON_KEY = "your-publishable-key"
$env:SUPABASE_SERVICE_ROLE_KEY = "server-only-service-role-key"
$env:CSAGENT_CORS_ORIGINS = "http://127.0.0.1:5173"
python -m uvicorn app.main:app --app-dir backend --reload
```

Apply `supabase/migrations/202607110001_agent_chat.sql` before using the API. Configure `.app/config.local.js` with `window.CSAGENT_CHAT_CONFIG = { apiBaseUrl: "http://127.0.0.1:8000" }` when the API runs elsewhere.

The initial answer engine composes cited extracts from visible Published Wiki Notes. It is intentionally deterministic; an LLM provider belongs behind the same `DeterministicAnswerEngine` contract later.

`SUPABASE_SERVICE_ROLE_KEY` is used only after the API has authenticated and authorized the Member through their own token. It persists the Agent-owned response and citation snapshot, which prevents a browser client from writing messages that claim to be from the Agent.
