# Quick Start: Push to GitHub & Deploy

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

## 2. Deploy to Render

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select **`tbudhe/tushar-kick-open-ai-react`** repository
4. Click **"Create Web Service"** (settings auto-configured!)
5. Wait 5-10 minutes
6. Access at: **`https://gen-ai-ik-demo.onrender.com`**

---

## 3. Test Your App

```sh
curl https://gen-ai-ik-demo.onrender.com/heartbeat
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

See `DEPLOYMENT_GUIDE.md` for detailed instructions
See `README.md` for full documentation
