import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { PLANS } from '@/constants/plans';
import Colors from '@/constants/colors';
import { PlanType } from '@/types';

export default function PlansScreen() {
  const handleSelectPlan = (planId: PlanType) => {
    router.push(`/listing/create?planId=${planId}` as any);
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Select Your Plan' }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose the Perfect Plan</Text>
          <Text style={styles.subtitle}>
            Get your business listed on BiasharaReview and start engaging with your customers
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {PLANS.map((plan, index) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                index === 1 && styles.planCardFeatured,
              ]}
            >
              {index === 1 && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={[
                  styles.planName,
                  index === 1 && styles.planNameFeatured,
                ]}>
                  {plan.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[
                    styles.price,
                    index === 1 && styles.priceFeatured,
                  ]}>
                    {formatPrice(plan.price, plan.currency)}
                  </Text>
                  <Text style={styles.priceLabel}>/ year</Text>
                </View>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <View style={[
                      styles.checkIcon,
                      index === 1 && styles.checkIconFeatured,
                    ]}>
                      <Check
                        size={16}
                        color={index === 1 ? Colors.light.primary : '#FFFFFF'}
                      />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  index === 1 && styles.selectButtonFeatured,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
              >
                <Text style={[
                  styles.selectButtonText,
                  index === 1 && styles.selectButtonTextFeatured,
                ]}>
                  Select {plan.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Why List with BiasharaReview?</Text>
          <Text style={styles.noteText}>
            ✓ Reach thousands of potential customers{'\n'}
            ✓ Build trust with verified reviews{'\n'}
            ✓ Respond to customer feedback directly{'\n'}
            ✓ Showcase your business with photos & details{'\n'}
            ✓ Get discovered in search results
          </Text>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.muted,
    lineHeight: 22,
  },
  plansContainer: {
    gap: 20,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  planCardFeatured: {
    borderColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -60 }],
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  planHeader: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  planNameFeatured: {
    color: Colors.light.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  priceFeatured: {
    color: Colors.light.primary,
  },
  priceLabel: {
    fontSize: 15,
    color: Colors.light.muted,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconFeatured: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 24,
  },
  selectButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectButtonFeatured: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  selectButtonTextFeatured: {
    fontWeight: '700' as const,
  },
  noteCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
  },
});
