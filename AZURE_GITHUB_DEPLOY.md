# 🚀 Azure Deployment via GitHub Actions

## ✅ Setup Complete!

I've created a GitHub Actions workflow that will automatically deploy your app to Azure whenever you push to the `main` branch.

---

## 📋 Steps to Deploy

### Step 1: Add Azure Publish Profile to GitHub Secrets

1. **Get the publish profile content**:
   ```sh
   cat azure-publish-profile.xml
   ```

2. **Go to your GitHub repository**:
   - https://github.com/tbudhe/tushar-kick-open-ai-react
   - Click **Settings** → **Secrets and variables** → **Actions**
   
3. **Create new repository secret**:
   - Click **"New repository secret"**
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste the entire content from `azure-publish-profile.xml`
   - Click **"Add secret"**

### Step 2: Push Your Code to GitHub

```sh
# Add the GitHub Actions workflow
git add .github/workflows/azure-deploy.yml

# Commit
git commit -m "Add GitHub Actions for Azure deployment"

# Push to trigger deployment
git push origin main
```

### Step 3: Monitor Deployment

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. Watch the deployment progress
4. Once complete (✅ green checkmark), your app is live!

### Step 4: Access Your App

```sh
# Test the deployment
curl https://gen-ai-ik-demo-nodejs.azurewebsites.net/heartbeat
```

Your app will be available at:
- **https://gen-ai-ik-demo-nodejs.azurewebsites.net**

---

## 🔄 How It Works

1. You push code to GitHub `main` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Builds React app
   - Compiles TypeScript server
   - Packages everything
   - Deploys to Azure
3. Your app updates automatically (no manual steps!)

---

## 🐛 Troubleshooting

### If deployment fails:

1. **Check GitHub Actions logs**:
   - Go to Actions tab in GitHub
   - Click on the failed workflow
   - Expand the steps to see errors

2. **Common issues**:
   - Missing secret → Re-add `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Build errors → Check package.json scripts
   - Azure quota → May need to upgrade from Free tier

### If app shows 503:

```sh
# Restart the web app
az webapp restart --resource-group resource-group-tbudhe-ik-ai-agent --name gen-ai-ik-demo-nodejs

# Wait 30 seconds and test
sleep 30 && curl https://gen-ai-ik-demo-nodejs.azurewebsites.net/heartbeat
```

---

## 🎯 Benefits of GitHub Actions Deployment

- ✅ **Automatic** - Deploy on every git push
- ✅ **Reliable** - Bypasses Kudu issues on Free tier
- ✅ **Trackable** - See deployment history in GitHub
- ✅ **Repeatable** - Same process every time
- ✅ **Free** - GitHub Actions is free for public repos

---

## ⚡ Quick Commands

```sh
# View publish profile
cat azure-publish-profile.xml

# Push and deploy
git add .
git commit -m "Update app"
git push origin main

# Check deployment status
# Go to: https://github.com/tbudhe/tushar-kick-open-ai-react/actions

# Test app
curl https://gen-ai-ik-demo-nodejs.azurewebsites.net/heartbeat
```

---

## 📌 Important Files

- `.github/workflows/azure-deploy.yml` - GitHub Actions workflow
- `azure-publish-profile.xml` - Azure credentials (don't commit this!)
- `package.json` - Build scripts
- `dist/` - Built files for deployment

---

## 🔐 Security Note

⚠️ **Do NOT commit `azure-publish-profile.xml` to git!**

The file contains sensitive credentials. It's only used to create the GitHub secret.

Add to `.gitignore`:
```sh
echo "azure-publish-profile.xml" >> .gitignore
```

---

## Next Steps

1. ✅ Copy publish profile content
2. ✅ Add to GitHub Secrets
3. ✅ Push code to GitHub
4. ✅ Watch deployment in Actions tab
5. ✅ Test your live app!

Need help? Check the GitHub Actions logs for detailed error messages.
