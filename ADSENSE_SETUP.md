# Google AdSense Setup Guide

Google AdSense ads are now integrated into Drumz.xyz. Follow these steps to enable them:

## Step 1: Sign Up for Google AdSense
1. Go to [Google AdSense](https://www.google.com/adsense)
2. Click **Sign Up** and follow the setup process
3. Add your website (drumz.xyz)
4. Google will review your site for compliance

## Step 2: Get Your Publisher ID
1. After approval, go to **Settings** → **Account** in AdSense
2. Copy your **Publisher ID** (looks like `ca-pub-1234567890123456`)

## Step 3: Add to Environment Variables
1. Copy `.env.local.example` to `.env.local` (or update existing `.env.local`)
2. Add your Publisher ID:
   ```
   VITE_GOOGLE_ADSENSE_PUB_ID=ca-pub-your-id-here
   ```
3. Save and restart the app

## Step 4: Ad Placements
Ads are currently placed in two locations:
- **Landing Page**: Bottom of "Ready to Create Your Beat?" section
- **Generate Page**: Right sidebar (desktop only)

## Step 5: Wait for Ads to Appear
- Google needs 24-48 hours to review and activate ads
- Once approved, ads will automatically display on your site
- You can monitor earnings in your AdSense dashboard

## Earning Money
- You earn revenue when users view ads (CPM) or click on them (CPC)
- Minimum payment threshold: $100 USD
- Payments are made monthly via your linked payment method

## Important Notes
- **Policy Compliance**: Make sure your site follows [Google AdSense policies](https://support.google.com/adsense/answer/48182)
- **Invalid Traffic**: Don't click your own ads or encourage clicks - Google will flag this
- **Mobile Responsive**: Drumz.xyz is fully mobile-responsive, so ads will show on all devices
- **Content Quality**: Higher quality content = better ad matching = higher earnings

## Customizing Ad Placements
To add more ad units:
1. Get additional slot IDs from your AdSense dashboard
2. Use the `<AdUnit>` component:
   ```tsx
   import { AdUnit } from "@/components/adsense-script";
   
   <AdUnit slotId="1234567890" format="auto" />
   ```

## Testing Locally
- Ads won't show on localhost (`http://localhost:5000`)
- Deploy to production to see live ads
- Use Google's [Ad Test IDs](https://support.google.com/adsense/answer/14666519) for testing

## Troubleshooting
- **No ads showing**: Check that `VITE_GOOGLE_ADSENSE_PUB_ID` is set correctly
- **Blank spaces**: Google may not have ads available - this is normal
- **Ads blocked**: Some ad blockers prevent ads from showing
- **Disapproved site**: Check AdSense dashboard for policy violations

For more help: [AdSense Help Center](https://support.google.com/adsense)
