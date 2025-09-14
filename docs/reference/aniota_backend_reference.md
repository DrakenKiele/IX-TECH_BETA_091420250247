# Aniota Backend Reference Guide

## 1. Starting the Backend (FastAPI)

From the project root, activate your virtual environment and run:

```
cd backend
uvicorn app.main:app --reload
```
- The API will be available at http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs

## 2. Health Checks

Test database connectivity:
- `GET /health/in`    → checks aniota_in DB
- `GET /health/think` → checks aniota_think DB
- `GET /health/out`   → checks aniota_out DB

## 3. Environment Variables

- Edit `.env` in the backend folder to set DB connection strings and other secrets.
- Example:
  ```
  ANIOTA_IN_DB_URL=postgresql://aniota_in_user:password@localhost:5432/aniota_in
  ANIOTA_THINK_DB_URL=postgresql://aniota_think_user:password@localhost:5432/aniota_think
  ANIOTA_OUT_DB_URL=postgresql://aniota_out_user:password@localhost:5432/aniota_out
  ```

## 4. Installing Dependencies

```
pip install -r requirements.txt
```

## 5. Running Tests

```
pytest
```

## 6. Adding New Endpoints
- Add new routes to `backend/app/main.py` or organize by module as needed.
- Use dependency injection to access the correct DB session.

## 7. Database Migrations
- Use Alembic or manual SQL for schema changes (not yet set up).

## 8. Common Issues
- If you see DB connection errors, check your `.env` and that PostgreSQL is running.
- If dependencies are missing, re-run `pip install -r requirements.txt`.

## 9. Starting Electron (Frontend)
- From the project root or frontend folder, run:
  ```
  npm install
  npm start
  ```
  (Adjust as needed for your Electron setup.)

---

**Update this guide as your project evolves!**
