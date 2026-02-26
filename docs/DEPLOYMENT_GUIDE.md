# Deployment Guide for Railway

## Step 1: Push Code to GitHub

Your code has been committed locally. You need to push it to GitHub:

### Option A: Using GitHub CLI (Recommended)
```sh
# Install GitHub CLI
brew install gh

# Authenticate
gh auth login

# Push your code
git push origin main
```

### Option B: Using Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Render Deployment"
4. Select scopes: `repo` (all)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

Then run:
```sh
# Update remote to use token
git remote set-url origin https://YOUR_TOKEN@github.com/tbudhe/tushar-kick-open-ai-react.git

# Push your code
git push origin main
```

### Option C: Using SSH (Most Secure)
```sh
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Update remote to use SSH
git remote set-url origin git@github.com:tbudhe/tushar-kick-open-ai-react.git

# Push your code
git push origin main
```

---

## Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)** and sign up using GitHub

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select "Deploy from GitHub Repo"
   - Connect your GitHub account if not already connected
   - Select repository: `tbudhe/tushar-kick-open-ai-react`

3. **Configure Service**
   - **Name**: gen-ai-ik-demo
   - **Branch**: main
   - **Runtime**: Docker
   - **Health Check Path**: `/heartbeat`
   
4. **Environment Variables**
   - `DATABASE_URL=<mongodb+srv://...>`
   - `NODE_ENV=production`
   - `JWT_SECRET=<secret>`

5. **Click "Deploy"**

6. **Wait for Deployment** (5-10 minutes)
   - Watch the build logs
   - Status will change to "Live" when ready

7. **Access Your App**
    - URL: `https://gen-ai-ik-demo-production-0c69.up.railway.app`
   - Test endpoints:
       - `https://gen-ai-ik-demo-production-0c69.up.railway.app/`
       - `https://gen-ai-ik-demo-production-0c69.up.railway.app/heartbeat`
       - `https://gen-ai-ik-demo-production-0c69.up.railway.app/health`

---

## Step 3: Test Your Deployment

```sh
# Test heartbeat endpoint
curl https://gen-ai-ik-demo-production-0c69.up.railway.app/heartbeat

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-12-09T...",
#   "uptime": 123.45,
#   "port": 3000
# }
```

---

## Troubleshooting

### If deployment fails:

1. **Check Build Logs** in Railway dashboard
2. **Common issues:**
   - Missing dependencies → Check package.json
   - Port binding → Server should use `process.env.PORT`
   - Build timeout → Free tier has 15 min limit

### If healthcheck fails:
- Verify `/heartbeat` returns HTTP 200
- Verify `DATABASE_URL` is set in Railway variables
- Run `railway logs --latest --lines 200`

---

## Railway CLI Shortcuts

```sh
railway status
railway deployment list
railway logs --latest --lines 200
```

---

## Next Steps After Deployment

1. Test all endpoints
2. Set up custom domain (if needed)
3. Configure environment variables for production
4. Enable monitoring and alerts
5. Set up GitHub Actions for CI/CD (optional)

---

## Cost Comparison

| Platform | Free Tier | Limitations | Best For |
|----------|-----------|-------------|----------|
| **Railway** | $5 credit/month | usage-based credits | Full-stack apps |
| **Fly.io** | Limited | 3 VMs max | Edge computing |

---

## Support

- Railway Docs: https://docs.railway.com
- Railway App: https://railway.app
- Railway Status: https://status.railway.com
