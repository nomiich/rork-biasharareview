import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import {
  UserProfile,
  UserStats,
  Badge,
  Activity,
  Follow,
  BookmarkList,
  ReviewDraft,
  Notification,
  Review,
} from '@/types';

const defaultNotificationSettings = {
  reviewLikes: true,
  reviewReplies: true,
  newFollowers: true,
  promotions: false,
};

const defaultStats: UserStats = {
  totalReviews: 0,
  totalPhotos: 0,
  totalHelpfulVotes: 0,
  totalPoints: 0,
  totalViews: 0,
  reviewsThisMonth: 0,
  citiesReviewed: 0,
};

export const [UserDashboardContext, useUserDashboard] = createContextHook(() => {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [bookmarkLists, setBookmarkLists] = useState<BookmarkList[]>([]);
  const [drafts, setDrafts] = useState<ReviewDraft[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserDashboard = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all([
        loadUserProfile(),
        loadActivities(),
        loadFollowers(),
        loadFollowing(),
        loadBookmarkLists(),
        loadDrafts(),
        loadNotifications(),
        loadUserReviews(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserDashboard();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, loadUserDashboard]);



  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.id));
      const statsDoc = await getDoc(doc(db, 'userStats', user.id));
      const badgesSnapshot = await getDocs(
        query(collection(db, 'badges'), where('userId', '==', user.id))
      );

      const userData = userDoc.data();
      const statsData = statsDoc.exists() ? statsDoc.data() : defaultStats;
      const badgesData = badgesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        earnedAt: (doc.data().earnedAt as Timestamp).toDate().toISOString(),
      } as Badge));

      const level = calculateLevel(statsData.totalPoints || 0);

      setUserProfile({
        ...user,
        bio: userData?.bio,
        city: userData?.city,
        username: userData?.username || user.name,
        phoneNumber: userData?.phoneNumber,
        joinedAt: userData?.created_at 
          ? (userData.created_at as Timestamp).toDate().toISOString() 
          : new Date().toISOString(),
        isPublicProfile: userData?.isPublicProfile ?? true,
        requireFollowApproval: userData?.requireFollowApproval ?? false,
        showActivity: userData?.showActivity ?? true,
        notificationSettings: userData?.notificationSettings || defaultNotificationSettings,
        stats: statsData as UserStats,
        badges: badgesData,
        level,
      });
    } catch (error: any) {
      console.error('Failed to load user profile:', error);
      if (error?.code !== 'unavailable') {
        console.error('Non-offline error:', error);
      } else {
        console.log('Offline mode: Using cached data');
      }
    }
  };

  const loadActivities = async () => {
    if (!user) return;

    try {
      const followingSnapshot = await getDocs(
        query(collection(db, 'follows'), where('followerId', '==', user.id))
      );
      const followingIds = followingSnapshot.docs.map(doc => doc.data().followingId);

      if (followingIds.length === 0) {
        setActivities([]);
        return;
      }

      const activitiesSnapshot = await getDocs(
        query(
          collection(db, 'activities'),
          where('userId', 'in', followingIds),
          orderBy('createdAt', 'desc'),
          limit(50)
        )
      );

      setActivities(
        activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        } as Activity))
      );
    } catch (error: any) {
      console.error('Failed to load activities:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load new activities');
      }
      setActivities([]);
    }
  };

  const loadFollowers = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'follows'),
        where('followingId', '==', user.id)
      );
      const snapshot = await getDocs(q);
      setFollowers(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        } as Follow))
      );
    } catch (error: any) {
      console.error('Failed to load followers:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load followers');
      }
    }
  };

  const loadFollowing = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', user.id)
      );
      const snapshot = await getDocs(q);
      setFollowing(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        } as Follow))
      );
    } catch (error: any) {
      console.error('Failed to load following:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load following');
      }
    }
  };

  const loadBookmarkLists = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'bookmarkLists'),
        where('userId', '==', user.id),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setBookmarkLists(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
          updatedAt: (doc.data().updatedAt as Timestamp).toDate().toISOString(),
        } as BookmarkList))
      );
    } catch (error: any) {
      console.error('Failed to load bookmark lists:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load bookmark lists');
      }
    }
  };

  const loadDrafts = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'reviewDrafts'),
        where('userId', '==', user.id),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setDrafts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
          updatedAt: (doc.data().updatedAt as Timestamp).toDate().toISOString(),
        } as ReviewDraft))
      );
    } catch (error: any) {
      console.error('Failed to load drafts:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load drafts');
      }
    }
  };

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      setNotifications(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
        } as Notification))
      );
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load notifications');
      }
    }
  };

  const loadUserReviews = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'reviews'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setUserReviews(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Review))
      );
    } catch (error: any) {
      console.error('Failed to load user reviews:', error);
      if (error?.code === 'unavailable') {
        console.log('Offline mode: Cannot load user reviews');
      }
    }
  };

  const calculateLevel = (points: number): number => {
    if (points < 50) return 1;
    if (points < 150) return 2;
    if (points < 300) return 3;
    if (points < 500) return 4;
    if (points < 1000) return 5;
    return Math.floor(points / 200) + 1;
  };

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.id), updates);
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, [user]);

  const followUser = useCallback(async (targetUserId: string) => {
    if (!user) return;

    try {
      const targetUserDoc = await getDoc(doc(db, 'users', targetUserId));
      const targetUser = targetUserDoc.data();
      const status = targetUser?.requireFollowApproval ? 'pending' : 'accepted';

      const followDoc = await addDoc(collection(db, 'follows'), {
        followerId: user.id,
        followingId: targetUserId,
        status,
        createdAt: serverTimestamp(),
      });

      const newFollow: Follow = {
        id: followDoc.id,
        followerId: user.id,
        followingId: targetUserId,
        status,
        createdAt: new Date().toISOString(),
      };

      setFollowing(prev => [...prev, newFollow]);

      if (status === 'accepted') {
        await addDoc(collection(db, 'notifications'), {
          userId: targetUserId,
          type: 'new_follower',
          title: 'New Follower',
          message: `${user.name} started following you`,
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  }, [user]);

  const unfollowUser = useCallback(async (targetUserId: string) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', user.id),
        where('followingId', '==', targetUserId)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(doc(db, 'follows', snapshot.docs[0].id));
        setFollowing(prev => prev.filter(f => f.followingId !== targetUserId));
      }
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  }, [user]);

  const createBookmarkList = useCallback(async (
    name: string,
    description: string,
    isPublic: boolean
  ) => {
    if (!user) return;

    try {
      const listDoc = await addDoc(collection(db, 'bookmarkLists'), {
        userId: user.id,
        name,
        description,
        isPublic,
        entityIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newList: BookmarkList = {
        id: listDoc.id,
        userId: user.id,
        name,
        description,
        isPublic,
        entityIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setBookmarkLists(prev => [newList, ...prev]);
      return newList;
    } catch (error) {
      console.error('Failed to create bookmark list:', error);
      throw error;
    }
  }, [user]);

  const addToBookmarkList = useCallback(async (listId: string, entityId: string) => {
    if (!user) return;

    try {
      const listRef = doc(db, 'bookmarkLists', listId);
      const listDoc = await getDoc(listRef);
      const entityIds = listDoc.data()?.entityIds || [];

      if (!entityIds.includes(entityId)) {
        await updateDoc(listRef, {
          entityIds: [...entityIds, entityId],
          updatedAt: serverTimestamp(),
        });

        setBookmarkLists(prev =>
          prev.map(list =>
            list.id === listId
              ? { ...list, entityIds: [...list.entityIds, entityId], updatedAt: new Date().toISOString() }
              : list
          )
        );
      }
    } catch (error) {
      console.error('Failed to add to bookmark list:', error);
      throw error;
    }
  }, [user]);

  const saveDraft = useCallback(async (draft: Omit<ReviewDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const draftDoc = await addDoc(collection(db, 'reviewDrafts'), {
        ...draft,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDraft: ReviewDraft = {
        id: draftDoc.id,
        ...draft,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDrafts(prev => [newDraft, ...prev]);
      return newDraft;
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  }, [user]);

  const deleteDraft = useCallback(async (draftId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'reviewDrafts', draftId));
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (error) {
      console.error('Failed to delete draft:', error);
      throw error;
    }
  }, [user]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [user]);

  const addPoints = useCallback(async (points: number, reason: string) => {
    if (!user || !userProfile) return;

    try {
      const newPoints = userProfile.stats.totalPoints + points;
      const newLevel = calculateLevel(newPoints);

      await updateDoc(doc(db, 'userStats', user.id), {
        totalPoints: newPoints,
      });

      setUserProfile(prev =>
        prev
          ? {
              ...prev,
              stats: { ...prev.stats, totalPoints: newPoints },
              level: newLevel,
            }
          : null
      );

      console.log(`Added ${points} points for: ${reason}`);
    } catch (error) {
      console.error('Failed to add points:', error);
    }
  }, [user, userProfile]);

  return useMemo(() => ({
    userProfile,
    activities,
    followers,
    following,
    bookmarkLists,
    drafts,
    notifications,
    userReviews,
    isLoading,
    updateUserProfile,
    followUser,
    unfollowUser,
    createBookmarkList,
    addToBookmarkList,
    saveDraft,
    deleteDraft,
    markNotificationAsRead,
    addPoints,
    refreshDashboard: loadUserDashboard,
  }), [
    userProfile,
    activities,
    followers,
    following,
    bookmarkLists,
    drafts,
    notifications,
    userReviews,
    isLoading,
    updateUserProfile,
    followUser,
    unfollowUser,
    createBookmarkList,
    addToBookmarkList,
    saveDraft,
    deleteDraft,
    markNotificationAsRead,
    addPoints,
    loadUserDashboard,
  ]);
});
