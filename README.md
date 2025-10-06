# Rungsted Havn Admin Dashboard

A comprehensive admin dashboard for Rungsted Havn harbor management built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Live KPIs**: Available spots, guests in harbor, daily bookings, and revenue
- **Interactive Spots Table**: Filter, search, and manage harbor spots with real-time updates
- **Live Map**: Visual representation of spots with color-coded availability
- **Booking Management**: Create, check-in/out, and cancel bookings
- **Status Management**: Change spot status with expected return times
- **Real-time Updates**: Live data synchronization using Supabase subscriptions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Maps**: React Leaflet with OpenStreetMap
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks + Supabase realtime

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server actions)
- `USE_MOCK`: Set to `true` to use mock data for development

### 3. Database Setup

Create the following tables in your Supabase database:

```sql
-- Harbors table
CREATE TABLE harbors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spots table
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  harbor_id UUID REFERENCES harbors(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  expected_return_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spot availability windows
CREATE TABLE spot_availability_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample harbor
INSERT INTO harbors (name, slug) VALUES ('Rungsted Havn', 'rungsted-havn');

-- Insert sample spots
INSERT INTO spots (harbor_id, code, name, latitude, longitude) VALUES
  ((SELECT id FROM harbors WHERE slug = 'rungsted-havn'), 'A1', 'Bro A - Plads 1', 55.8833, 12.5167),
  ((SELECT id FROM harbors WHERE slug = 'rungsted-havn'), 'A2', 'Bro A - Plads 2', 55.8835, 12.5169),
  ((SELECT id FROM harbors WHERE slug = 'rungsted-havn'), 'B1', 'Bro B - Plads 1', 55.8837, 12.5171),
  ((SELECT id FROM harbors WHERE slug = 'rungsted-havn'), 'B2', 'Bro B - Plads 2', 55.8839, 12.5173),
  ((SELECT id FROM harbors WHERE slug = 'rungsted-havn'), 'C1', 'Bro C - Plads 1', 55.8841, 12.5175);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Flows

### With Mock Data (Recommended for Development)

1. Set `USE_MOCK=true` in `.env.local`
2. Navigate to `/admin/rungsted-havn`
3. The dashboard will load with mock data
4. Test all functionality without database setup

### With Real Database

1. Set up Supabase database with the provided schema
2. Set `USE_MOCK=false` in `.env.local`
3. Configure your Supabase credentials
4. Navigate to `/admin/rungsted-havn`

## Key Features Testing

### 1. KPI Dashboard
- View live metrics for available spots, guests, bookings, and revenue
- Metrics update in real-time as data changes

### 2. Spots Management
- **Filter by status**: Ledig, Reserveret, Optaget
- **Filter by area**: Bro A, B, C
- **Search**: Find spots by code or name
- **Status changes**: Click "Skift status" to change spot availability
- **Create bookings**: Click "Opret booking" to create new reservations

### 3. Interactive Map
- **Color-coded markers**: Green (available), Yellow (reserved), Red (occupied)
- **Click markers**: Highlights corresponding table row
- **Popup details**: Shows spot information and status

### 4. Booking Management
- **View upcoming bookings**: See all reservations
- **Check-in/out**: Update booking status
- **Cancel bookings**: Remove reservations
- **Payment tracking**: Monitor payment status

### 5. Real-time Updates
- **Live synchronization**: Changes appear instantly across all components
- **Multi-user support**: Multiple admins can work simultaneously
- **Conflict detection**: System prevents double bookings

## API Endpoints

- `POST /api/admin/bookings` - Create new booking
- `POST /api/admin/spots/[spotId]/status` - Update spot status
- `PATCH /api/admin/bookings/[id]` - Update booking status

## Development Notes

- All components are fully typed with TypeScript
- Uses shadcn/ui for consistent design system
- Implements proper error handling and loading states
- Follows Next.js 14 App Router patterns
- Includes comprehensive form validation with Zod
- Supports both mock and real data modes

## Deployment

### Deploy to Vercel (Recommended)

This application is optimized for Vercel deployment:

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yourrepo)

#### Manual Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**
   
   Add these environment variables in your Vercel project settings:
   
   **Required for Production:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `HARBOR_SLUG` - Your harbor slug (e.g., `rungsted-havn`)
   
   **Optional:**
   - `USE_MOCK` - Set to `false` for production (uses real database)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Your app will be live at `https://your-project.vercel.app`

#### Environment Variables Setup in Vercel

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable from `env.example`
4. Make sure to uncheck "USE_MOCK" or set it to `false` for production
5. Save and redeploy

#### Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS as instructed by Vercel

### Deploy to Other Platforms

The application is compatible with any platform that supports Next.js 14:
- **Netlify**: Use the Next.js runtime
- **Railway**: Auto-detects Next.js
- **DigitalOcean App Platform**: Select Next.js as framework

Ensure all environment variables are configured in your deployment platform.






