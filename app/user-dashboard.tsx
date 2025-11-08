import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Award,
  TrendingUp,
  Plus,
  Users,
  Eye,
  BookmarkPlus,
  FileText,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDashboard } from '@/contexts/UserDashboardContext';
import Colors from '@/constants/colors';

type TabType = 'overview' | 'reviews' | 'photos' | 'stats' | 'bookmarks';

export default function UserDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const {
    userProfile,
    activities,
    userReviews,
    bookmarkLists,
    isLoading,
    refreshDashboard,
  } = useUserDashboard();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'reviews' as TabType, label: 'Reviews', icon: MessageSquare },
    { id: 'photos' as TabType, label: 'Photos', icon: ImageIcon },
    { id: 'stats' as TabType, label: 'Stats', icon: Award },
    { id: 'bookmarks' as TabType, label: 'Lists', icon: BookmarkPlus },
  ];

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MessageSquare size={24} color={Colors.light.primary} />
          <Text style={styles.statValue}>{userProfile?.stats.totalReviews || 0}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statCard}>
          <ImageIcon size={24} color={Colors.light.secondary} />
          <Text style={styles.statValue}>{userProfile?.stats.totalPhotos || 0}</Text>
          <Text style={styles.statLabel}>Photos</Text>
        </View>
        <View style={styles.statCard}>
          <ThumbsUp size={24} color={Colors.light.success} />
          <Text style={styles.statValue}>{userProfile?.stats.totalHelpfulVotes || 0}</Text>
          <Text style={styles.statLabel}>Helpful</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={Colors.light.warning} />
          <Text style={styles.statValue}>{userProfile?.stats.totalPoints || 0}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      {userProfile && userProfile.stats.reviewsThisMonth > 0 && (
        <View style={styles.highlightCard}>
          <TrendingUp size={20} color={Colors.light.primary} />
          <Text style={styles.highlightText}>
            You&apos;re among the top reviewers this month with {userProfile.stats.reviewsThisMonth}{' '}
            reviews!
          </Text>
        </View>
      )}

      <View style={styles.activitySection}>
        <Text style={styles.subsectionTitle}>Recent Activity</Text>
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity, index) => (
            <TouchableOpacity
              key={`${activity.id}-${index}`}
              style={styles.activityCard}
              onPress={() => {
                if (activity.entityId) {
                  router.push(`/entity/${activity.entityId}` as any);
                }
              }}
            >
              <Image
                source={{
                  uri:
                    activity.userAvatar ||
                    'https://ui-avatars.com/api/?name=' + encodeURIComponent(activity.userName),
                }}
                style={styles.activityAvatar}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityUser}>{activity.userName}</Text>
                <Text style={styles.activityText}>
                  {activity.type === 'review'
                    ? `reviewed ${activity.entityName}`
                    : activity.type === 'photo'
                    ? `added photos to ${activity.entityName}`
                    : 'activity'}
                </Text>
                <Text style={styles.activityTime}>{formatTimeAgo(activity.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.listContainer}>
      {userReviews.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={48} color={Colors.light.muted} />
          <Text style={styles.emptyText}>No reviews yet</Text>
          <Text style={styles.emptySubtext}>Write your first review to get started</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/review/submit')}>
            <Text style={styles.emptyButtonText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      ) : (
        userReviews.map((review) => (
          <TouchableOpacity
            key={review.id}
            style={styles.reviewCard}
            onPress={() => router.push(`/entity/${review.entityId}` as any)}
          >
            <View style={styles.reviewHeader}>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < review.rating ? Colors.light.secondary : Colors.light.border}
                    fill={i < review.rating ? Colors.light.secondary : 'transparent'}
                  />
                ))}
              </View>
              <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.reviewText} numberOfLines={3}>
              {review.reviewText}
            </Text>
            <View style={styles.reviewStats}>
              <View style={styles.reviewStat}>
                <ThumbsUp size={14} color={Colors.light.muted} />
                <Text style={styles.reviewStatText}>{review.likes}</Text>
              </View>
              {review.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderPhotos = () => {
    const photos: string[] = [];
    userReviews.forEach((review) => {
      if (review.photoUrls) {
        photos.push(...review.photoUrls);
      }
    });

    if (photos.length === 0) {
      return (
        <View style={styles.emptyState}>
          <ImageIcon size={48} color={Colors.light.muted} />
          <Text style={styles.emptyText}>No photos yet</Text>
          <Text style={styles.emptySubtext}>Add photos to your reviews</Text>
        </View>
      );
    }

    return (
      <View style={styles.photosGrid}>
        {photos.map((photoUrl, index) => (
          <TouchableOpacity key={`${photoUrl}-${index}`} style={styles.photoCard}>
            <Image source={{ uri: photoUrl }} style={styles.photoImage} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderStats = () => {
    if (!userProfile) return null;

    const stats = userProfile.stats;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statDetailCard}>
          <Eye size={32} color={Colors.light.primary} />
          <Text style={styles.statDetailValue}>{stats.totalViews.toLocaleString()}</Text>
          <Text style={styles.statDetailLabel}>Profile Views</Text>
          <Text style={styles.statDetailSubtext}>Your reviews have been seen</Text>
        </View>

        <View style={styles.statDetailCard}>
          <ThumbsUp size={32} color={Colors.light.success} />
          <Text style={styles.statDetailValue}>{stats.totalHelpfulVotes}</Text>
          <Text style={styles.statDetailLabel}>Helpful Votes</Text>
          <Text style={styles.statDetailSubtext}>People found you helpful</Text>
        </View>

        <View style={styles.statDetailCard}>
          <Award size={32} color={Colors.light.warning} />
          <Text style={styles.statDetailValue}>{stats.totalPoints}</Text>
          <Text style={styles.statDetailLabel}>Total Points</Text>
          <Text style={styles.statDetailSubtext}>Level {userProfile.level}</Text>
        </View>

        <View style={styles.statDetailCard}>
          <TrendingUp size={32} color={Colors.light.secondary} />
          <Text style={styles.statDetailValue}>{stats.reviewsThisMonth}</Text>
          <Text style={styles.statDetailLabel}>This Month</Text>
          <Text style={styles.statDetailSubtext}>Keep up the great work!</Text>
        </View>

        {userProfile.badges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.subsectionTitle}>Your Badges</Text>
            <View style={styles.badgesGrid}>
              {userProfile.badges.map((badge) => (
                <View key={badge.id} style={styles.badgeCard}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDesc} numberOfLines={2}>
                    {badge.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderBookmarks = () => {
    if (bookmarkLists.length === 0) {
      return (
        <View style={styles.emptyState}>
          <BookmarkPlus size={48} color={Colors.light.muted} />
          <Text style={styles.emptyText}>No lists yet</Text>
          <Text style={styles.emptySubtext}>Create lists to organize your favorite businesses</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => {}}>
            <Text style={styles.emptyButtonText}>Create List</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {bookmarkLists.map((list) => (
          <TouchableOpacity key={list.id} style={styles.bookmarkCard}>
            <View style={styles.bookmarkHeader}>
              <Text style={styles.bookmarkName}>{list.name}</Text>
              <Text style={styles.bookmarkCount}>{list.entityIds.length}</Text>
            </View>
            {list.description && (
              <Text style={styles.bookmarkDesc} numberOfLines={2}>
                {list.description}
              </Text>
            )}
            <Text style={styles.bookmarkVisibility}>
              {list.isPublic ? '🌐 Public' : '🔒 Private'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Dashboard',
          headerStyle: { backgroundColor: Colors.light.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.profileSection}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Users size={24} color={Colors.light.primary} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile?.username || user?.name}</Text>
            <Text style={styles.profileLevel}>Level {userProfile?.level || 1}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon
                size={20}
                color={activeTab === tab.id ? Colors.light.primary : Colors.light.muted}
              />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'photos' && renderPhotos()}
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'bookmarks' && renderBookmarks()}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => router.push('/review/submit')}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabsScroll: {
    maxHeight: 60,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tabActive: {
    backgroundColor: Colors.light.primary + '15',
    borderColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.muted,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    paddingVertical: 32,
  },
  overviewContainer: {
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.muted,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500' as const,
  },
  activitySection: {
    marginTop: 8,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.border,
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  activityText: {
    fontSize: 13,
    color: Colors.light.text,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  listContainer: {
    gap: 12,
  },
  reviewCard: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewStatText: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.light.success + '15',
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoCard: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    gap: 16,
  },
  statDetailCard: {
    padding: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statDetailValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 12,
  },
  statDetailLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 4,
  },
  statDetailSubtext: {
    fontSize: 13,
    color: Colors.light.muted,
    marginTop: 4,
  },
  badgesSection: {
    marginTop: 8,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
  },
  bookmarkCard: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookmarkName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
  },
  bookmarkCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  bookmarkDesc: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  bookmarkVisibility: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
