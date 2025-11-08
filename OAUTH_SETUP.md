# Google OAuth Setup Instructions for BiasharaReview

## Google Sign-In Setup

### 1. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project `biashara-review` or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **OAuth client ID**

### 2. Configure OAuth Consent Screen (if not done)

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in the required information:
   - App name: BiasharaReview
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### 3. Create OAuth Client IDs

You need to create **3 separate OAuth client IDs**:

#### A. Web Client ID (Required for all platforms)
1. Application type: **Web application**
2. Name: BiasharaReview Web
3. Authorized redirect URIs:
   ```
   https://auth.expo.io/@YOUR_EXPO_USERNAME/biasharareview
   ```
4. Save and copy the **Client ID**

#### B. iOS Client ID
1. Application type: **iOS**
2. Name: BiasharaReview iOS
3. Bundle ID: `com.yourcompany.biasharareview` (from app.json)
4. Save and copy the **Client ID**

#### C. Android Client ID
1. Application type: **Android**
2. Name: BiasharaReview Android
3. Package name: `com.yourcompany.biasharareview` (from app.json)
4. SHA-1 certificate fingerprint:
   - For development, get it from Expo by running:
     ```bash
     expo credentials:manager
     ```
   - Select Android > Select build credentials > View credentials
5. Save and copy the **Client ID**

### 4. Update the Login Screen

Open `app/auth/login.tsx` and replace the placeholder values:

```typescript
const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
  webClientId: '628511126451-PASTE_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
  iosClientId: '628511126451-PASTE_IOS_CLIENT_ID_HERE.apps.googleusercontent.com',
  androidClientId: '628511126451-PASTE_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
  redirectUri,
});
```

---

## Update app.json

Add the URL scheme to your `app.json`:

```json
{
  "expo": {
    "scheme": "biasharareview",
    "ios": {
      "bundleIdentifier": "com.yourcompany.biasharareview"
    },
    "android": {
      "package": "com.yourcompany.biasharareview"
    }
  }
}
```

---

## Testing

### Test on Development:
1. Run the app: `expo start`
2. Test on physical device or emulator
3. Click "Continue with Google"
4. Complete the authentication flow

### Common Issues:

1. **Google Sign-In fails**: 
   - Verify all Client IDs are correct
   - Check that OAuth consent screen is configured
   - Ensure redirect URI matches exactly

2. **Redirect URI mismatch**:
   - The redirect URI must match exactly (including trailing slashes)
   - Format: `https://auth.expo.io/@YOUR_EXPO_USERNAME/biasharareview`

---

## Production Setup

Before publishing to app stores:

1. **Google**: 
   - Create production OAuth client IDs
   - Submit OAuth consent screen for verification

2. **Firebase**:
   - Enable production mode
   - Set up proper security rules
   - Configure authorized domains

---

## Security Notes

- Never commit OAuth credentials to version control
- Use environment variables for sensitive data in production
- Regularly rotate client secrets
- Enable 2FA for all developer accounts
- Monitor OAuth token usage in respective consoles
