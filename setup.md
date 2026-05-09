# GitHub Deployment Setup Guide

Follow these steps exactly in order to push your Credex AI Spend Audit project to GitHub.

## Step 1: Create an Empty GitHub Repository
1. Go to [GitHub.com](https://github.com) and log into your account.
2. Click the `+` icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `credex-audit`).
4. Set it to **Public** or **Private** (either is fine).
5. **IMPORTANT:** Do *not* check the boxes to add a README, .gitignore, or license. You want the repository to be completely empty.
6. Click the green **Create repository** button.

## Step 2: Push Your Local Code to GitHub
Open your terminal, ensure you are inside your project folder (`C:\Users\HP\.gemini\antigravity\scratch\credex-audit`), and run the following commands one by one:

```bash
# 1. Initialize a new local Git repository (if you haven't already)
git init

# 2. Stage all your files for the first commit
# (Your .gitignore will automatically block .env.local and node_modules from being staged)
git add .

# 3. Save the staged files into a commit
git commit -m "Initial commit: Credex AI Spend Audit ready for production"

# 4. Rename the default branch to 'main'
git branch -M main

# 5. Connect your local folder to the GitHub repository you just created
# REPLACE THE URL BELOW WITH YOUR ACTUAL GITHUB REPOSITORY URL!
git remote add origin https://github.com/YOUR_USERNAME/credex-audit.git

# 6. Push all your code up to GitHub
git push -u origin main
```

## Step 3: Verify
Refresh your GitHub repository page in your browser. You should now see all your folders (`src`, `components`, etc.) and your `README.md` file successfully uploaded!

*(Note: You will notice that `.env.local` and `.local-db.json` are completely absent from GitHub. This is proof that your `.gitignore` is working perfectly and protecting your secrets).*

## Step 4: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **Add New** -> **Project**.
3. Import the GitHub repository you just created.
4. Before clicking Deploy, open the **Environment Variables** section and add:
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**!
