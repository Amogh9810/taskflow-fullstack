# Download Help & Troubleshooting

Having trouble downloading the TaskFlow project? This guide will help.

## How to Download from v0

### Method 1: Using v0 Download Button (Recommended)

1. **Look for the download button**
   - Find the **three-dot menu (⋮)** in the top-right corner of v0
   - Look for "Download" or "Export" option
   - This downloads a ZIP file of your project

2. **Extract the ZIP**
   ```bash
   unzip taskflow.zip
   cd taskflow
   ```

3. **Start the setup**
   ```bash
   pnpm install
   ```

### Method 2: Using v0 CLI

If you have v0 CLI installed:
```bash
v0 download <project-id>
cd taskflow
pnpm install
```

### Method 3: Copy from Browser

If download isn't working:
1. Open v0 project in your browser
2. Select all files you need (see FILES_INCLUDED.md)
3. Copy them to your local machine
4. Run `pnpm install`

### Method 4: Using GitHub (If Connected)

If your v0 project is connected to GitHub:
```bash
# First, push code to GitHub from v0
git clone <your-repo-url>
cd taskflow
pnpm install
```

---

## Common Download Issues & Solutions

### Issue 1: "Download button not found"

**Solution:**
- Look in the **top-right corner** for three dots (⋮)
- Click it to find export/download options
- If not visible, try a different browser (Chrome, Firefox, Safari)

### Issue 2: "ZIP file is too large"

**Solution:**
- This is normal! The ZIP includes all source code
- Size should be 2-5 MB
- After extracting and running `pnpm install`, you'll have 400+ MB of dependencies
- This is expected and normal

### Issue 3: "Download times out / stops halfway"

**Solution:**
- Check your internet connection
- Try downloading again
- Use a different browser
- Use Method 4 (GitHub) instead if available

### Issue 4: "Cannot extract ZIP file"

**Solution:**
```bash
# Make sure you have a zip extractor
# macOS/Linux: Use built-in or unzip command
unzip taskflow.zip

# Windows: Use built-in extractor or 7-Zip
# Extract to a folder with no spaces in the path
```

### Issue 5: "File not found after download"

**Solution:**
- Check your Downloads folder
- Search for "taskflow.zip" on your computer
- Make sure antivirus didn't quarantine it
- Try downloading again

### Issue 6: "Downloaded file is corrupted"

**Solution:**
```bash
# Try using the tar.gz version if available
tar -xzf taskflow.tar.gz
cd taskflow

# Or re-download and try again
```

---

## After Downloaded - Setup Issues

### Issue 7: "pnpm command not found"

**Solution:**
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### Issue 8: "npm install/pnpm install fails"

**Solution:**
```bash
# Clear cache and try again
rm -rf node_modules
pnpm install --no-frozen-lockfile

# Or use npm instead
npm install
```

### Issue 9: "PORT 3000 or 5173 already in use"

**Solution:**
```bash
# Find and kill process on port
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue 10: "Database connection error"

**Solution:**
1. Check DATABASE_URL in `taskflow-api/.env`
2. Verify PostgreSQL is running
3. Test connection: `psql <connection-string>`
4. See DOWNLOAD_INSTRUCTIONS.md for database setup

---

## File Organization After Download

After extraction, you should see:

```
taskflow/
├── START_HERE.md                ← Read this first!
├── taskflow-api/                ← Backend
├── taskflow-ui/                 ← Frontend
├── package.json
└── (other docs)
```

If you see this structure, download was successful!

---

## What to Do If Download Really Won't Work

### Option A: Copy Files Manually

All files are visible in v0. You can:
1. Click on each file in v0
2. Copy the code
3. Paste into your local editor
4. Create the same file structure locally

This is tedious but works if download is broken.

### Option B: Use GitHub Clone

If v0 is connected to GitHub:
1. Push your code to GitHub from v0
2. Clone locally: `git clone <url>`
3. Much easier and faster!

### Option C: Contact Support

If none of these work:
1. Go to https://vercel.com/help
2. Open a support ticket
3. Mention you can't download the project
4. They can help with download issues

---

## Verify Download is Complete

After downloading and extracting, verify:

```bash
# Should exist and be non-empty
ls -la taskflow-api/src/
ls -la taskflow-ui/src/

# Should show documentation
ls -la *.md

# Should show configs
cat package.json
cat pnpm-workspace.yaml
```

All of these should exist and contain code.

---

## Size Reference

After download, your folder sizes should be:

```
taskflow/                ~2-5 MB     (source code only)
├── taskflow-api/        ~0.5 MB
├── taskflow-ui/         ~0.4 MB
├── docs (*.md files)    ~1 MB
└── config files         ~0.1 MB

After pnpm install:      ~400+ MB    (includes node_modules)
├── node_modules/        ~380 MB     (normal and expected!)
├── source code          ~20 MB
```

If your download is much smaller, something may be wrong.

---

## Success Checklist

After downloading, you should have:

- ✅ `START_HERE.md` file
- ✅ `taskflow-api/` folder with backend code
- ✅ `taskflow-ui/` folder with frontend code
- ✅ `package.json` and `pnpm-workspace.yaml`
- ✅ Multiple `*.md` documentation files
- ✅ `.env.example` files in both folders

If any of these are missing, try downloading again.

---

## Still Need Help?

### Read These Files (In Order)
1. `START_HERE.md` - Quick overview
2. `DOWNLOAD_INSTRUCTIONS.md` - Detailed setup
3. `README.md` - Full documentation
4. `PROJECT_STATUS.md` - What's been built

### Common Fixes
```bash
# Clear everything and start fresh
rm -rf node_modules pnpm-lock.yaml
pnpm install --force

# Check Node.js version
node --version

# Check pnpm version
pnpm --version

# List files to verify download
ls -la taskflow-api/src/
ls -la taskflow-ui/src/
```

### Get More Help
- Run `setup.sh` (macOS/Linux) or `setup.bat` (Windows)
- This script checks your environment and guides setup
- Shows any missing dependencies or configuration issues

---

## Pro Tips

1. **Don't download to Desktop** - Use a dedicated dev folder
2. **Use pnpm** - Faster and better than npm for monorepos
3. **Create `.env` files** - Copy from `.env.example`
4. **Check DATABASE_URL** - Most common setup issue
5. **Keep docs handy** - Have START_HERE.md visible while setup

---

## Download Methods Ranked

1. **v0 Download Button** ← Easiest
2. **GitHub Clone** (if connected) ← Good option
3. **v0 CLI** ← If you have CLI installed
4. **Manual Copy** ← Last resort

---

**Still stuck? The setup scripts can help!**

```bash
# On macOS/Linux
chmod +x setup.sh
./setup.sh

# On Windows
setup.bat
```

These check your environment and guide you through setup!

---

**Your TaskFlow is ready to download and use locally! 🚀**
