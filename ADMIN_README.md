# Admin Panel Documentation

## 🔐 Admin Access

### Login Credentials
- **URL**: `/admin/login`
- **Username**: `fazrilukman`
- **Password**: `Fajrilukman123_`

## 📋 Admin Features

### 1. Dashboard (`/admin/dashboard`)
- Overview statistics (Projects, Certificates, Comments)
- Recent comments activity
- Quick action buttons to manage content
- Real-time data from Supabase

### 2. Projects Management (`/admin/projects`)
**Features:**
- ✅ Create new projects
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Search projects by title/description
- ✅ Manage project details:
  - Title & Description
  - Image URL
  - Live Demo Link
  - GitHub Repository Link
  - Features (array)
  - Tech Stack (array)

### 3. Certificates Management (`/admin/certificates`)
**Features:**
- ✅ Add certificates by image URL
- ✅ Delete certificates
- ✅ Search certificates
- ✅ Image preview before upload
- ✅ Statistics (total, monthly, yearly)

### 4. Comments Management (`/admin/comments`)
**Features:**
- ✅ View all comments
- ✅ Pin/Unpin comments
- ✅ Delete comments
- ✅ Filter by: All, Pinned, Regular
- ✅ Search by username or content
- ✅ Statistics display

## 🚀 Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
Run the SQL script provided in your Supabase SQL Editor to create:
- `projects` table
- `certificates` table
- `portfolio_comments` table
- Row Level Security policies
- Storage bucket for profile images

### 3. Access Admin Panel
1. Navigate to `http://localhost:5174/admin/login`
2. Enter credentials
3. Start managing your portfolio!

## 🔒 Security Features

- **Session-based authentication** using `sessionStorage`
- **Protected routes** - redirects to login if not authenticated
- **Logout functionality** clears session
- **Supabase RLS policies** for database security

## 🎨 UI Features

- **Responsive design** - works on mobile, tablet, desktop
- **Dark theme** matching your portfolio
- **Smooth animations** and transitions
- **Loading states** for better UX
- **Toast notifications** using SweetAlert2
- **Sidebar navigation** with active state

## 📱 Responsive Behavior

- **Mobile**: Sidebar collapses, hamburger menu
- **Tablet**: Adjustable sidebar
- **Desktop**: Full sidebar always visible

## 🛠️ Tech Stack

- **React** - UI framework
- **React Router** - Routing
- **Supabase** - Backend & Database
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **SweetAlert2** - Notifications
- **Framer Motion** - Animations

## 📝 Notes

- Session expires when browser is closed
- Images use direct URLs (not uploaded to server)
- Comments from public users cannot be pinned by default (RLS policy)
- Admin can pin/unpin any comment via admin panel

## 🔧 Troubleshooting

**"Supabase not configured" error:**
- Check `.env` file exists with correct credentials
- Restart development server after adding `.env`
- Verify Supabase project is active

**Cannot login:**
- Check username/password match exactly (case-sensitive)
- Clear browser cache/cookies
- Check browser console for errors

**Data not loading:**
- Verify Supabase connection
- Check RLS policies are enabled
- Ensure tables exist in database
