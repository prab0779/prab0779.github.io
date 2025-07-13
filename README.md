# AOTR Value Hub

Attack on Titan Revolution Value List - The most trusted trading platform for AOTR items.

## 🚀 Live Demo

Visit the live application: [https://yourusername.github.io/aotr/](https://yourusername.github.io/aotr/)

## 📋 Setup Instructions

### 1. Fork and Clone
1. Fork this repository to your GitHub account
2. Clone your forked repository locally
3. Install dependencies: `npm install`

### 2. Supabase Setup
1. Create a [Supabase](https://supabase.com) account and project
2. Go to Settings → API in your Supabase dashboard
3. Copy your Project URL and anon public key

### 3. GitHub Secrets Configuration
For GitHub Pages deployment, add these secrets to your repository:

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Add these repository secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key

### 4. Enable GitHub Pages
1. Go to Settings → Pages in your GitHub repository
2. Set Source to "GitHub Actions"
3. The site will automatically deploy when you push to the main branch

### 5. Local Development
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run locally:
```bash
npm run dev
```

## 🛠️ Manual Deployment

You can also deploy manually using:
```bash
npm run deploy
```

## 📁 Project Structure

- `/src` - React application source code
- `/supabase/migrations` - Database schema migrations
- `/.github/workflows` - GitHub Actions for automatic deployment
- `/public` - Static assets

## 🔧 Technologies Used

- React + TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- Vite (Build tool)
- GitHub Pages (Hosting)

## 📝 License

This project is open source and available under the MIT License.
