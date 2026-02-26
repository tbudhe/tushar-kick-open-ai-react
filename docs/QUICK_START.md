# Quick Start: Push to GitHub & Deploy (Railway)

## 1. Push to GitHub (Choose ONE method)

### Method A: GitHub CLI (Easiest)
```sh
brew install gh
gh auth login
git push origin main
```

### Method B: Personal Access Token
```sh
# 1. Get token from: https://github.com/settings/tokens
# 2. Update remote:
git remote set-url origin https://YOUR_TOKEN@github.com/tbudhe/tushar-kick-open-ai-react.git
git push origin main
```

### Method C: SSH
```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add key to: https://github.com/settings/keys
git remote set-url origin git@github.com:tbudhe/tushar-kick-open-ai-react.git
git push origin main
```

---

## 2. Deploy to Railway

1. Go to **https://railway.app** → Sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select **`tbudhe/tushar-kick-open-ai-react`**
4. Add required variables (`DATABASE_URL`, `NODE_ENV=production`, etc.)
5. Wait for deployment to finish
6. Access at: **`https://gen-ai-ik-demo-production-0c69.up.railway.app`**

---

## 3. Test Your App

```sh
curl https://gen-ai-ik-demo-production-0c69.up.railway.app/heartbeat
```

**Done!** Your app is live on the internet!

---

## Files Created for Deployment

- `render.yaml` - Render configuration
- `.dockerignore` - Optimized Docker builds
- Health endpoints in `server.ts`
- Updated `package.json` for cloud deployment
- Fixed `Dockerfile` for production

---

## Need Help?

See `RAILWAY_DEPLOYMENT.md` for detailed instructions
See `README.md` for full documentation
