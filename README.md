# EventLink

## User Dashboard

This project now includes a user dashboard which aggregates a user's registrations, upcoming events (with countdowns), achievements, certificates, badges, and participation history.

How to try it locally:

1. Start the backend:

```powershell
cd backend; npm install; npm run dev
```

2. Start the frontend:

```powershell
cd frontend; npm install; npm run dev
```

3. Register or login using the frontend (or create a user via the API), then visit:

	- Frontend dashboard: http://localhost:3000/dashboard

API endpoint (protected): GET /api/gamification/dashboard/me

Example cURL (replace <TOKEN> with your bearer token):

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/gamification/dashboard/me
```

Certificates are available at GET /api/certificates/:registrationId (protected). This is currently a placeholder implementation which returns a JSON stub. In future this can be extended to generate and return real PDF certificates.
