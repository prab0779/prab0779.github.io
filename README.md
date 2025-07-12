# AOT:R Value Hub

The #1 most trusted Attack on Titan Revolution Value List maintained by experienced players worldwide.

## Features

- 📊 Comprehensive item database with 200+ items
- 🧮 Advanced trade calculator with tax computation
- 📈 Real-time value change tracking
- 🎰 Family spin wheel with accurate drop rates
- 👥 Live online user counter
- 📱 Mobile-responsive design

## Live Site

Visit the live site at: [https://www.aotrvalue.com](https://www.aotrvalue.com)

## GitHub Pages Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Setup Instructions

1. **Fork or clone this repository**

2. **Set up Supabase secrets in GitHub:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add the following repository secrets:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

4. **Push to main branch:**
   - Any push to the main branch will trigger automatic deployment
   - Check the Actions tab to monitor deployment progress

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prab0779/aotr.git
   cd aotr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Admin Access

To access the admin panel at `/admin`:

1. Create an admin user in your Supabase project
2. Navigate to `/admin` on your deployed site
3. Sign in with your admin credentials

## Database Setup

The project uses Supabase for data storage. Migration files are included in the `supabase/migrations` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is not affiliated with the official Attack on Titan Revolution game.