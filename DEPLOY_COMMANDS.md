# Deploy Commands for Mattrix Mini App

## Step 1: Push to GitHub
```bash
cd "/Users/ricardomastrangelo/VS Studio/BD Emperess/mattrix-miniapp"
git remote rm origin
git remote add origin https://github.com/Ricosworks1/mattrix-miniapp.git
git push -u origin main
```

## Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: mattrix-miniapp
4. Add these Environment Variables:

```
JWT_SECRET=mattrix-hackathon-jwt-secret-key-2025
NEXT_PUBLIC_URL=https://mattrix-miniapp.vercel.app
NEXT_PUBLIC_MINIKIT_PROJECT_ID=mattrix-crm-hackathon
NEXT_PUBLIC_FARCASTER_HEADER=farcaster-header-demo
NEXT_PUBLIC_FARCASTER_PAYLOAD=farcaster-payload-demo
NEXT_PUBLIC_FARCASTER_SIGNATURE=farcaster-signature-demo
NEYNAR_API_KEY=demo-neynar-api-key-for-hackathon
REDIS_URL=https://demo-redis-url.upstash.io
REDIS_TOKEN=demo-redis-token
```

5. Click Deploy!

## Step 3: Update Mini App URL
After deployment, update NEXT_PUBLIC_URL with your actual Vercel URL.