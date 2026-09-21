# DevPilot Deployment Guide: Render & TiDB Serverless

This guide outlines step-by-step instructions to deploy the **DevPilot** full-stack application on **Render** backed by a distributed **TiDB Serverless** cloud database.

---

## 1. TiDB Cloud Serverless Setup

TiDB Serverless is a fully-managed, MySQL-compatible distributed SQL database with automated scaling and built-in TLS security.

### Step 1: Create a Free TiDB Serverless Cluster
1. Navigate to [TiDB Cloud Console](https://tidbcloud.com/) and sign in.
2. Click **Create Cluster** and select **Serverless (Free Tier)**.
3. Choose your preferred region (e.g. `US East / N. Virginia`).
4. Click **Create**. Your cluster will be active within ~20 seconds.

### Step 2: Retrieve TiDB Connection Parameters
1. On your cluster overview page, click the **Connect** button (top right).
2. Choose **Connection Type**: `General` or `Java (Spring Boot)`.
3. Note your connection details:
   - **Host**: e.g., `gateway01.us-east-1.prod.aws.tidbcloud.com`
   - **Port**: `4000`
   - **User**: e.g., `4A4B...root`
   - **Password**: Your cluster password
   - **Database**: `devpilot_db` (or default `test`)

### Step 3: Run Schema Initialization (Optional)
Spring Boot's Hibernate will automatically run `ddl-auto: update` to create all tables.
Alternatively, you can copy the contents of `db/schema-tidb.sql` and run it directly in the **SQL Editor** tab of your TiDB Cloud Console.

---

## 2. GitHub Repository Push

Ensure your code is pushed to your GitHub account:

```bash
# Initialize and commit
git init
git add .
git commit -m "Deploy: DevPilot Copilot with TiDB & Render blueprint"

# Link to your GitHub repo (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/ManoharAkuthota/DevPilot.git
git push -u origin main
```

---

## 3. Render Deployment (Two Methods)

### Method A: 1-Click Render Blueprint (Recommended)
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your `DevPilot` GitHub repository.
4. Render will detect `render.yaml` and configure both services:
   - `devpilot-backend`: Docker web service with Java 21 JRE
   - `devpilot-frontend`: Static site with React 19 + Vite
5. When prompted, fill in your TiDB environment variables:
   - `TIDB_HOST`: Your TiDB cluster host
   - `TIDB_USER`: Your TiDB cluster user
   - `TIDB_PASSWORD`: Your TiDB cluster password
   - `TIDB_DATABASE`: `devpilot_db`
6. Click **Apply**. Render will automatically build the container and deploy!

---

### Method B: Manual Service Creation on Render

#### 1. Backend Service
- **Type**: Web Service
- **Environment**: Docker
- **Root Directory**: `backend` (or root with Dockerfile `backend/Dockerfile`)
- **Health Check Path**: `/api/system/metrics`
- **Environment Variables**:
  ```env
  SPRING_PROFILES_ACTIVE=tidb
  TIDB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
  TIDB_PORT=4000
  TIDB_DATABASE=devpilot_db
  TIDB_USER=your_tidb_user
  TIDB_PASSWORD=your_tidb_password
  APP_JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
  ```

#### 2. Frontend Static Site
- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Rewrite Rule**:
  - Source: `/*`
  - Destination: `/index.html`
- **Environment Variable**:
  ```env
  VITE_API_BASE_URL=https://your-backend-app.onrender.com
  ```

---

## 4. Verification After Deployment

1. **Backend Health & Swagger**:
   - Visit: `https://your-backend-app.onrender.com/swagger-ui.html`
   - Visit: `https://your-backend-app.onrender.com/api/system/metrics`
2. **Frontend UI**:
   - Open your Render frontend URL (e.g. `https://devpilot-frontend.onrender.com`).
   - Use the **1-Click Demo** button or sign in with `alex@devpilot.io` / `DevPilot2025!`.
3. **Database Verification in TiDB**:
   - Run in TiDB SQL Editor:
     ```sql
     SELECT id, username, email, role, productivity_score FROM devpilot_db.users;
     SELECT id, title, status, priority FROM devpilot_db.tasks;
     ```
