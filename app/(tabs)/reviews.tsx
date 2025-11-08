import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, ThumbsUp, Flag, Calendar } from 'lucide-react-native';
import { mockReviews } from '@/mocks/reviews';
import { mockEntities } from '@/mocks/entities';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const userReviews = mockReviews.filter(r => r.userId === user?.id);
  const recentReviews = mockReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            color={star <= rating ? Colors.light.secondary : Colors.light.border}
            fill={star <= rating ? Colors.light.secondary : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const renderReview = (review: typeof mockReviews[0]) => {
    const entity = mockEntities.find(e => e.id === review.entityId);
    if (!entity) return null;

    return (
      <TouchableOpacity
        key={review.id}
        style={styles.reviewCard}
        onPress={() => router.push(`/entity/${entity.id}` as any)}
      >
        <View style={styles.reviewHeader}>
          <View style={styles.userInfo}>
            {review.userAvatar ? (
              <Image source={{ uri: review.userAvatar }} style={styles.userAvatar} />
            ) : (
              <View style={styles.userAvatarPlaceholder}>
                <Text style={styles.userAvatarText}>
                  {review.userName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{review.userName}</Text>
                {review.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <View style={styles.dateRow}>
                <Calendar size={12} color={Colors.light.muted} />
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          {renderStars(review.rating)}
        </View>

        <Text style={styles.entityName}>{entity.name}</Text>
        <Text style={styles.reviewText} numberOfLines={3}>
          {review.reviewText}
        </Text>

        {review.photoUrls && review.photoUrls.length > 0 && (
          <Image
            source={{ uri: review.photoUrls[0] }}
            style={styles.reviewPhoto}
          />
        )}

        <View style={styles.reviewActions}>
          <View style={styles.actionButton}>
            <ThumbsUp size={16} color={Colors.light.muted} />
            <Text style={styles.actionText}>{review.likes}</Text>
          </View>
          <View style={styles.actionButton}>
            <Flag size={16} color={Colors.light.muted} />
            <Text style={styles.actionText}>{review.reports}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Reviews</Text>
        <Text style={styles.subtitle}>Latest reviews from the community</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {userReviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Reviews ({userReviews.length})</Text>
            {userReviews.map(renderReview)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {recentReviews.map(renderReview)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  verifiedBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  entityName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewPhoto: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: Colors.light.muted,
  },
});
