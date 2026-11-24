# ☁️ CloudBox

A cloud file-storage web app built with **Next.js, Tailwind CSS, PostgreSQL (Neon) and Cloudinary**. Sign up, log in, then upload, preview, search, download and delete photos and PDFs.

- **Max file size:** 4 MB
- **Storage per user:** 100 MB
- **Allowed types:** JPG, PNG, GIF, WebP and PDF

## ✨ Features

- Landing page with navigation bar and features section
- Login and signup with show/hide password and clear error messages
- Dashboard with sidebar (All files, Photos, PDFs, storage meter, account, log out)
- Search and sort (newest, oldest, name, size)
- Grid and list views
- Drag-and-drop uploads anywhere on the page
- Multiple file uploads with individual progress bars
- Full-screen photo preview with next/previous arrows
- Keyboard navigation (arrow keys and Esc)
- Delete confirmation and toast notifications
- Loading placeholders and empty states
- Dark and light themes
- Responsive design for mobile, tablet and desktop

## 🛠️ Tech Stack

| Part | Technology |
|---|---|
| Frontend and backend | Next.js 14 (App Router, API Routes) |
| Styling | Tailwind CSS |
| Database | PostgreSQL on Neon |
| File storage | Cloudinary |
| Authentication | bcrypt password hashing, JWT in an httpOnly cookie |
| Hosting | Vercel |

You do **not** need to install a database on your computer. The same Neon database can be used during development and after deployment.

---

# ⚙️ Setup: From Start to Finish

## Step 1. Install the Tools

- **Node.js 20 or newer:** https://nodejs.org/
- **Git:** https://git-scm.com/
- **GitHub account:** https://github.com/

Check your installed versions:

```bash
node -v
npm -v
git --version
```

## Step 2. Create the Database on Neon

1. Visit https://neon.com/ and sign up for a free account.
2. Click **Create Project**.
3. Give your project a name, such as `cloudbox`.
4. Create the project.
5. Open the project dashboard and click **Connect**.
6. Copy the PostgreSQL connection string.

It looks similar to:

```env
postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

This will be your `DATABASE_URL`.

Make sure the database password is visible before copying the connection string.

## Step 3. Configure Cloudinary

1. Visit https://cloudinary.com/ and create a free account.
2. Open your Cloudinary dashboard.
3. Copy the following credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Go to **Settings → Security**.
5. Enable **Allow delivery of PDF and ZIP files** if available in your account settings.

Cloudinary is used to store and deliver uploaded files.

## Step 4. Configure Environment Variables

Open a terminal inside your project folder.

Create `.env.local` by copying `.env.example` if your project includes it.

**Windows:**

```powershell
copy .env.example .env.local
```

**Mac/Linux:**

```bash
cp .env.example .env.local
```

If `.env.example` does not exist, create `.env.local` manually in the project root.

Add your credentials:

```env
DATABASE_URL=your_neon_connection_string

JWT_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholder values with your actual credentials.

Keep each value on one line without quotes.

**Important:** Never upload `.env.local` to GitHub.

## Step 5. Install Packages and Create Database Tables

Install project dependencies:

```bash
npm install
```

Run the database setup script:

```bash
npm run setup-db
```

This connects to Neon and executes `database/schema.sql`.

Expected output:

```text
Done. Tables in your database: files, users
```

**Manual alternative:**

1. Open your Neon dashboard.
2. Navigate to SQL Editor.
3. Open `database/schema.sql` in your project.
4. Copy the SQL code.
5. Paste it into the Neon SQL Editor.
6. Click Run.

## Step 6. Run CloudBox Locally

Start the development server:

```bash
npm run dev
```

Open your browser:

http://localhost:3000

Register an account and test the following:

- Upload a photo.
- Upload a PDF.
- Preview an image.
- Search and sort files.
- Download files.
- Delete files.

---

**CloudBox – Your Files, Your Space, Your Control.**
