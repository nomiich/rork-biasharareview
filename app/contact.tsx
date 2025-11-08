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
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { submitClaimRequest } from '@/lib/firebaseService';
import Colors from '@/constants/colors';

export default function ContactScreen() {
  const { entityId, entityName } = useLocalSearchParams<{ entityId?: string; entityName?: string }>();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: entityName || '',
    contactName: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to submit a claim request.');
      router.push('/auth/login' as any);
      return;
    }

    if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone || !formData.message) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    if (entityId && !formData.message.toLowerCase().includes('claim')) {
      Alert.alert('Claim Request', 'Please describe why you are claiming this profile in your message.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (entityId) {
        await submitClaimRequest({
          userId: user.id,
          entityId: entityId,
          businessName: formData.businessName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          status: 'pending',
        });
        
        Alert.alert(
          'Claim Request Submitted',
          'Your claim request has been submitted successfully. Our team will review it and get back to you soon.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Message Sent',
          'Your message has been sent successfully. We will get back to you soon.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }

      setFormData({
        businessName: '',
        contactName: user.name || '',
        email: user.email || '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: entityId ? 'Claim Profile' : 'Contact Us',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {entityId && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Claiming: {entityName}</Text>
            <Text style={styles.infoText}>
              Please provide the following information to verify your claim. Our team will review your request and contact you within 2-3 business days.
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.businessName}
              onChangeText={(text) => setFormData({ ...formData, businessName: text })}
              placeholder="Enter business name"
              placeholderTextColor={Colors.light.muted}
              editable={!entityId}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.contactName}
              onChangeText={(text) => setFormData({ ...formData, contactName: text })}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.light.muted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              placeholderTextColor={Colors.light.muted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.light.muted}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {entityId ? 'Why are you claiming this profile? *' : 'Message *'}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
              placeholder={
                entityId
                  ? 'Please describe your relationship to this business and provide proof of ownership...'
                  : 'Enter your message here...'
              }
              placeholderTextColor={Colors.light.muted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  {entityId ? 'Submit Claim Request' : 'Send Message'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {entityId && (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>What happens next?</Text>
            <Text style={styles.noteText}>
              1. Our team will review your claim request{'\n'}
              2. We may contact you for additional verification{'\n'}
              3. Once approved, you&apos;ll get access to your dashboard{'\n'}
              4. You can then manage your profile and respond to reviews
            </Text>
          </View>
        )}
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
  infoCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
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
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 8,
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
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 22,
  },
});
