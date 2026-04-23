# Backend Project

## Run

```bash
cd Backend
npm i
npm start
```

## Environment

Create `Backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-secret
CLIENT_ORIGIN=http://localhost:5173
```

## API Docs (Swagger)

- UI: `GET /api-docs` (example: `http://localhost:4000/api-docs`)
- JSON: `GET /api-docs.json`

