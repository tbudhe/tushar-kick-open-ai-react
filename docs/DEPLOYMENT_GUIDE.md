# 🚀 Deployment Guide for Render.com

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

## Step 2: Deploy to Render.com

1. **Go to [render.com](https://render.com)** and sign up using GitHub

2. **Connect GitHub Repository**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select repository: `tbudhe/tushar-kick-open-ai-react`

3. **Configure Service** (Auto-filled from render.yaml)
   - **Name**: gen-ai-ik-demo
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Runtime**: Docker
   - **Plan**: Free
   
4. **Advanced Settings** (Already in render.yaml)
   - Health Check Path: `/heartbeat`
   - Auto-Deploy: Yes

5. **Click "Create Web Service"**

6. **Wait for Deployment** (5-10 minutes)
   - Watch the build logs
   - Status will change to "Live" when ready

7. **Access Your App**
   - URL: `https://gen-ai-ik-demo.onrender.com`
   - Test endpoints:
     - `https://gen-ai-ik-demo.onrender.com/`
     - `https://gen-ai-ik-demo.onrender.com/heartbeat`
     - `https://gen-ai-ik-demo.onrender.com/health`

---

## Step 3: Test Your Deployment

```sh
# Test heartbeat endpoint
curl https://gen-ai-ik-demo.onrender.com/heartbeat

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

1. **Check Build Logs** in Render dashboard
2. **Common issues:**
   - Missing dependencies → Check package.json
   - Port binding → Server should use `process.env.PORT`
   - Build timeout → Free tier has 15 min limit

### If app sleeps (Free tier):
- First request after 15 min inactivity takes ~30 seconds
- Upgrade to paid plan ($7/month) for always-on service

---

## Alternative: Quick Deploy Button

Add this to your GitHub README for one-click deploy:

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tbudhe/tushar-kick-open-ai-react)
```

---

## Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Set up custom domain (if needed)
3. ✅ Configure environment variables for production
4. ✅ Enable monitoring and alerts
5. ✅ Set up GitHub Actions for CI/CD (optional)

---

## Cost Comparison

| Platform | Free Tier | Limitations | Best For |
|----------|-----------|-------------|----------|
| **Render** | ✅ Yes | Sleeps after 15 min | Docker apps, demos |
| **Azure F1** | ✅ Yes | No Docker support | Basic Node.js apps |
| **Azure B1** | ❌ $13/month | Quota limits | Production Azure apps |
| **Railway** | ✅ $5 credit/month | 500 hours | Full-stack apps |
| **Fly.io** | ✅ Limited | 3 VMs max | Edge computing |

---

## Support

- Render Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com
