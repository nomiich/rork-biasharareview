# Automatic User Document Creation - Implementation Summary

## Overview

Your Firebase app now automatically creates and updates user documents in Firestore whenever a user signs up or signs in. This is handled server-side via a tRPC backend endpoint using Firebase Admin SDK.

## How It Works

### Flow Diagram
```
User Signs Up/In → Firebase Auth
                      ↓
              AuthContext detects auth change
                      ↓
           Calls backend auth.syncUser mutation
                      ↓
         Backend (Firebase Admin SDK) creates/updates user doc
                      ↓
              Client loads user profile
                      ↓
                User is logged in
```

### Implementation Details

#### 1. Backend Endpoint (`backend/trpc/routes/auth/sync-user/route.ts`)
- **Purpose:** Create or update user documents in Firestore
- **Technology:** Firebase Admin SDK (server-side, bypasses security rules)
- **Input:** `uid`, `displayName`, `email`, `photoURL` from Firebase Auth
- **Logic:**
  - If user document exists → Update `lastLogin`, `email`, `displayName`, `photoURL`
  - If new user → Create document with all fields

**User Document Structure:**
```typescript
{
  uid: string                  // Firebase Auth UID
  displayName: string          // User's display name
  email: string                // User's email
  photoURL: string | null      // Profile photo URL
  createdAt: Timestamp         // Account creation time
  lastLogin: Timestamp         // Last login time
  role: "user"                 // User role (default: "user")
  reviewsCount: 0              // Number of reviews
  isActive: true               // Account active status
  favorites: []                // Favorite entity IDs
  isEntityOwner: false         // Is entity owner
  ownedEntityIds: []           // Owned entity IDs
  isPublicProfile: true        // Public profile setting
  requireFollowApproval: false // Follow approval setting
  showActivity: true           // Show activity setting
  notificationSettings: {      // Notification preferences
    reviewLikes: true
    reviewReplies: true
    newFollowers: true
    promotions: false
  }
}
```

#### 2. Client Integration (`contexts/AuthContext.tsx`)
- **Purpose:** Detect auth changes and sync with backend
- **Trigger:** Firebase `onAuthStateChanged` listener
- **Process:**
  1. User authenticates (email/password or Google)
  2. `onAuthStateChanged` fires with Firebase User object
  3. `syncUserWithBackend()` calls backend tRPC endpoint
  4. `loadUserProfile()` loads user data from Firestore
  5. User state is set, app shows dashboard

**Key Functions:**
- `syncUserWithBackend(fbUser)` - Calls backend to create/update user doc
- `loadUserProfile(userId)` - Loads user profile from Firestore (with 5 retries)

## Benefits

### 1. **Reliability**
- Server-side creation eliminates offline/network issues
- Backend has full Firestore access
- No security rule conflicts

### 2. **Security**
- User documents created with proper validation
- Server-side logic prevents tampering
- Admin SDK bypasses client-side security rules

### 3. **Consistency**
- Same logic for all authentication methods
- Unified user document structure
- Automatic field updates on each login

### 4. **Auditability**
- `lastLogin` tracks user activity
- `createdAt` shows account age
- Easy to implement analytics

## Files Changed

### New Files
- `backend/trpc/routes/auth/sync-user/route.ts` - User sync endpoint
- `AUTO_USER_SYNC_IMPLEMENTATION.md` - This documentation

### Modified Files
- `backend/trpc/app-router.ts` - Added auth router
- `contexts/AuthContext.tsx` - Added backend sync call
- `FIREBASE_SETUP.md` - Updated with v1.3.0 changes
- `package.json` - Added `firebase-admin` dependency

## Testing

### Test New User Signup
1. Sign up with email/password
2. Check Firebase Console → Authentication (user should exist)
3. Check Firebase Console → Firestore → users collection
4. Verify document has all fields (uid, displayName, email, createdAt, lastLogin, etc.)

### Test Existing User Login
1. Sign in with existing account
2. Check user document in Firestore
3. Verify `lastLogin` timestamp is updated
4. Other fields should remain unchanged (except email, displayName, photoURL if changed)

### Test Google Sign-In
1. Sign in with Google
2. Check user document includes Google profile data
3. `displayName` should be from Google account
4. `photoURL` should be Google profile picture
5. Verify `lastLogin` updates on subsequent logins

### Console Logs to Watch
```
[SyncUser] Syncing user: <uid>
[SyncUser] User <uid> exists, updating lastLogin
[SyncUser] Creating new user document for <uid>
[SyncUser] User <uid> created successfully
[AuthContext] Syncing user with backend: <uid>
[AuthContext] User sync result: { success: true, ... }
[AuthContext] Loading user profile for userId: <uid>
[AuthContext] User profile loaded successfully
```

## Troubleshooting

### Issue: User document not created
**Solution:** Check backend logs for errors. Ensure Firebase Admin SDK is properly initialized.

### Issue: "Firebase Admin not initialized" error
**Solution:** Verify `EXPO_PUBLIC_FIREBASE_PROJECT_ID` is set in `.env` file.

### Issue: User profile loading fails
**Solution:** 
1. Verify user document was created in Firestore
2. Check Firestore security rules (users collection needs `allow read: if true;`)
3. Check console logs for specific error messages

### Issue: lastLogin not updating
**Solution:** Verify backend endpoint is being called. Check for errors in backend logs.

## Configuration

### Required Environment Variables
```env
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Firestore Security Rules
The backend uses Firebase Admin SDK which bypasses security rules. However, clients still need read access:

```javascript
match /users/{userId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

## API Reference

### tRPC Endpoint: `auth.syncUser`

**Input Schema:**
```typescript
{
  uid: string,              // Required: Firebase Auth UID
  displayName?: string,     // Optional: User's display name
  email: string,            // Required: User's email
  photoURL?: string         // Optional: Profile photo URL
}
```

**Response:**
```typescript
{
  success: boolean,         // Operation success status
  isNewUser: boolean,       // Whether user was newly created
  message: string,          // Success/error message
  error?: string            // Error code if failed
}
```

**Usage (Client):**
```typescript
import { trpcClient } from '@/lib/trpc';

const result = await trpcClient.auth.syncUser.mutate({
  uid: user.uid,
  displayName: user.displayName || undefined,
  email: user.email || '',
  photoURL: user.photoURL || undefined,
});
```

## Future Enhancements

### Possible Additions
1. **Email Verification Status** - Track if email is verified
2. **Phone Number** - Add phone authentication support
3. **User Preferences** - Store additional user settings
4. **Account Deletion** - Handle user account deletion
5. **Merge Accounts** - Logic to merge duplicate accounts
6. **Analytics Integration** - Track user signup/login events

### Backend Extensibility
The sync endpoint can be extended to:
- Send welcome emails to new users
- Create default data (e.g., onboarding checklist)
- Trigger analytics events
- Update third-party services (CRM, email marketing)

---

**Version:** 1.0  
**Date:** January 2025  
**Author:** Automated via tRPC + Firebase Admin SDK
