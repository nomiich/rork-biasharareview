import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Building2, MapPin, Globe, Upload } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { submitListing, uploadImage } from '@/lib/firebaseService';
import Colors from '@/constants/colors';
import { Category, EntityType, PlanType } from '@/types';

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Retail', value: 'retail' },
  { label: 'Tech', value: 'tech' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Finance', value: 'finance' },
];

export default function CreateListingScreen() {
  const { planId } = useLocalSearchParams<{ planId?: PlanType }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | undefined>();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entityType: 'business' as EntityType,
    selectedCategories: [] as Category[],
    location: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const toggleCategory = (category: Category) => {
    if (formData.selectedCategories.includes(category)) {
      setFormData({
        ...formData,
        selectedCategories: formData.selectedCategories.filter(c => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        selectedCategories: [...formData.selectedCategories, category],
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to submit a listing.');
      return;
    }

    if (!planId) {
      Alert.alert('Plan Required', 'Please select a plan first.');
      router.push('/plans' as any);
      return;
    }

    if (!formData.name || !formData.description || formData.selectedCategories.length === 0 || !formData.location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      let profilePhotoUrl: string | undefined;
      
      if (imageUri) {
        profilePhotoUrl = await uploadImage(imageUri, `listings/${user.id}/${Date.now()}.jpg`);
      }

      await submitListing({
        userId: user.id,
        planId: planId,
        name: formData.name,
        description: formData.description,
        entityType: formData.entityType,
        categories: formData.selectedCategories,
        location: formData.location,
        contactInfo: {
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          website: formData.website || undefined,
          address: formData.address || undefined,
          social: {
            facebook: formData.facebook || undefined,
            instagram: formData.instagram || undefined,
            twitter: formData.twitter || undefined,
          },
        },
        profilePhotoUrl,
        status: 'pending',
      });

      Alert.alert(
        'Listing Submitted',
        'Your listing has been submitted for review. Our team will review it and get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/profile' as any),
          },
        ]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit your listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Add Listing' }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building2 size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter name"
              placeholderTextColor={Colors.light.muted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe your business..."
              placeholderTextColor={Colors.light.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>



          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categories * (Select at least one)</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryChip,
                    formData.selectedCategories.includes(cat.value) && styles.categoryChipActive,
                  ]}
                  onPress={() => toggleCategory(cat.value)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    formData.selectedCategories.includes(cat.value) && styles.categoryChipTextActive,
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Location & Contact</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="e.g., Dar es Salaam, Tanzania"
              placeholderTextColor={Colors.light.muted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Full address"
              placeholderTextColor={Colors.light.muted}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="+255..."
                placeholderTextColor={Colors.light.muted}
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="email@example.com"
                placeholderTextColor={Colors.light.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website URL</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(text) => setFormData({ ...formData, website: text })}
              placeholder="https://..."
              placeholderTextColor={Colors.light.muted}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Social Media</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              value={formData.facebook}
              onChangeText={(text) => setFormData({ ...formData, facebook: text })}
              placeholder="Facebook username"
              placeholderTextColor={Colors.light.muted}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              value={formData.instagram}
              onChangeText={(text) => setFormData({ ...formData, instagram: text })}
              placeholder="Instagram username"
              placeholderTextColor={Colors.light.muted}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Twitter</Text>
            <TextInput
              style={styles.input}
              value={formData.twitter}
              onChangeText={(text) => setFormData({ ...formData, twitter: text })}
              placeholder="Twitter username"
              placeholderTextColor={Colors.light.muted}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Upload size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Profile Photo</Text>
          </View>

          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.pickedImage} />
            ) : (
              <View style={styles.imagePickerPlaceholder}>
                <Upload size={32} color={Colors.light.muted} />
                <Text style={styles.imagePickerText}>Tap to upload photo</Text>
                <Text style={styles.imagePickerSubtext}>JPG, JPEG, or PNG</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Review</Text>
          )}
        </TouchableOpacity>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Your listing will be reviewed by our team within 24-48 hours. You&apos;ll receive an email once it&apos;s approved.
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  typeButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.muted,
  },
  typeButtonTextActive: {
    color: Colors.light.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  imagePickerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  imagePickerPlaceholder: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  imagePickerText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  imagePickerSubtext: {
    fontSize: 13,
    color: Colors.light.muted,
  },
  pickedImage: {
    width: '100%',
    height: 200,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  noteCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  noteText: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 20,
  },
});
