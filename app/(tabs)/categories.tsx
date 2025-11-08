import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Star, MapPin } from 'lucide-react-native';
import { mockEntities } from '@/mocks/entities';
import Colors from '@/constants/colors';
import { Category, Entity } from '@/types';

const categoryData: { name: string; value: Category; emoji: string; description: string }[] = [
  { 
    name: 'Restaurants', 
    value: 'restaurant', 
    emoji: '🍽️',
    description: 'Dining and culinary experiences',
  },
  { 
    name: 'Retail', 
    value: 'retail', 
    emoji: '🛍️',
    description: 'Shopping centers and stores',
  },
  { 
    name: 'Tech', 
    value: 'tech', 
    emoji: '💻',
    description: 'Technology companies and hubs',
  },
  { 
    name: 'Healthcare', 
    value: 'healthcare', 
    emoji: '🏥',
    description: 'Medical facilities and services',
  },
  { 
    name: 'Education', 
    value: 'education', 
    emoji: '📚',
    description: 'Schools and learning centers',
  },
  { 
    name: 'Finance', 
    value: 'finance', 
    emoji: '💰',
    description: 'Banks and financial services',
  },
];

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categoryEntities = selectedCategory
    ? mockEntities.filter(e => e.categories.includes(selectedCategory))
    : [];

  if (selectedCategory) {
    const categoryInfo = categoryData.find(c => c.value === selectedCategory);
    
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity 
            onPress={() => setSelectedCategory(null)}
            style={styles.backButton}
          >
            <ChevronRight size={24} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>{categoryInfo?.emoji}</Text>
            <Text style={styles.headerTitle}>{categoryInfo?.name}</Text>
            <Text style={styles.headerSubtitle}>{categoryEntities.length} businesses</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {categoryEntities.length > 0 ? (
            <View style={styles.entitiesGrid}>
              {categoryEntities.map((entity: Entity) => (
                <TouchableOpacity
                  key={entity.id}
                  style={styles.entityCard}
                  onPress={() => router.push(`/entity/${entity.id}` as any)}
                >
                  <Image 
                    source={{ uri: entity.imageUrl }} 
                    style={styles.entityImage}
                  />
                  <View style={styles.entityInfo}>
                    <Text style={styles.entityName} numberOfLines={1}>
                      {entity.name}
                    </Text>
                    <View style={styles.locationRow}>
                      <MapPin size={12} color={Colors.light.muted} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {entity.location}
                      </Text>
                    </View>
                    <View style={styles.scoreRow}>
                      <Star size={14} color={Colors.light.secondary} fill={Colors.light.secondary} />
                      <Text style={styles.scoreText}>{entity.biasharaScore.toFixed(1)}</Text>
                      <Text style={styles.reviewCount}>({entity.totalReviews})</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No businesses in this category yet</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse businesses by category</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesGrid}>
          {categoryData.map((cat) => {
            const count = mockEntities.filter(e => 
              e.categories.includes(cat.value)
            ).length;

            return (
              <TouchableOpacity
                key={cat.value}
                style={styles.categoryCard}
                onPress={() => setSelectedCategory(cat.value)}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <View style={styles.categoryTextContainer}>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryDescription}>{cat.description}</Text>
                    <Text style={styles.categoryCount}>{count} businesses</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.light.muted} />
              </TouchableOpacity>
            );
          })}
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
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
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
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 13,
    color: Colors.light.muted,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  entitiesGrid: {
    gap: 16,
  },
  entityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entityImage: {
    width: 100,
    height: 100,
  },
  entityInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  entityName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: Colors.light.muted,
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.muted,
  },
});
