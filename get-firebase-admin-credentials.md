# Get Firebase Admin SDK Credentials

## Step-by-Step Instructions

### 1. Go to Firebase Console
Open: https://console.firebase.google.com/

### 2. Select Your Project
Click on **forum-ilc** project

### 3. Open Project Settings
- Click the **gear icon** ⚙️ (top left, next to "Project Overview")
- Select **Project settings**

### 4. Go to Service Accounts Tab
- Click on the **Service accounts** tab
- You'll see a section titled "Firebase Admin SDK"

### 5. Generate New Private Key
- Click the **"Generate new private key"** button
- A dialog will appear warning you to keep the key secure
- Click **"Generate key"**

### 6. Download the JSON File
- A JSON file will automatically download (e.g., `forum-ilc-firebase-adminsdk-xxxxx-xxxxx.json`)
- **Keep this file secure** - it contains sensitive credentials

### 7. Update Your .env File
Run this command (replace path with your downloaded file):

```bash
node update-firebase-admin.js ~/Downloads/forum-ilc-firebase-adminsdk-xxxxx-xxxxx.json
```

Or if the file is in a different location:

```bash
node update-firebase-admin.js /path/to/your/downloaded-file.json
```

### 8. Restart Your Server
After updating, restart your development server:

```bash
npm run dev
```

## What the JSON File Looks Like

The downloaded JSON file will contain something like:

```json
{
  "type": "service_account",
  "project_id": "forum-ilc",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@forum-ilc.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40forum-ilc.iam.gserviceaccount.com"
}
```

The script will automatically extract all these values and update your `.env` file.

## Troubleshooting

### Can't find "Service accounts" tab?
- Make sure you're in **Project settings** (not User settings)
- Look for tabs: General, Service accounts, General, etc.

### "Generate new private key" button not visible?
- Make sure you have admin/owner permissions on the Firebase project
- Try refreshing the page

### Script says "Error reading JSON file"?
- Make sure the file path is correct
- Check that the file exists and is readable
- Use the full path: `/Users/yourname/Downloads/filename.json`

