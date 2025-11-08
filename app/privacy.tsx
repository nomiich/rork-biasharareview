import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: January 26, 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to BiasharaReview. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          
          <Text style={styles.subsectionTitle}>2.1 Personal Information</Text>
          <Text style={styles.paragraph}>
            When you register or use our app, we may collect:
          </Text>
          <Text style={styles.bulletPoint}>• Name and contact information</Text>
          <Text style={styles.bulletPoint}>• Email address</Text>
          <Text style={styles.bulletPoint}>• Phone number</Text>
          <Text style={styles.bulletPoint}>• Profile photo</Text>
          <Text style={styles.bulletPoint}>• Business information (for listing owners)</Text>

          <Text style={styles.subsectionTitle}>2.2 Usage Information</Text>
          <Text style={styles.paragraph}>
            We automatically collect certain information when you use the app:
          </Text>
          <Text style={styles.bulletPoint}>• Device information</Text>
          <Text style={styles.bulletPoint}>• Log data and analytics</Text>
          <Text style={styles.bulletPoint}>• App usage patterns</Text>
          <Text style={styles.bulletPoint}>• Reviews and ratings you submit</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
          <Text style={styles.bulletPoint}>• Process your listings and reviews</Text>
          <Text style={styles.bulletPoint}>• Verify business ownership claims</Text>
          <Text style={styles.bulletPoint}>• Enable in-app chat for claimed listings</Text>
          <Text style={styles.bulletPoint}>• Send you notifications and updates</Text>
          <Text style={styles.bulletPoint}>• Improve our app and user experience</Text>
          <Text style={styles.bulletPoint}>• Prevent fraud and ensure security</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share your information with:
          </Text>
          <Text style={styles.bulletPoint}>• Service providers who help us operate the app</Text>
          <Text style={styles.bulletPoint}>• Business owners (limited to reviews and chat messages)</Text>
          <Text style={styles.bulletPoint}>• Law enforcement when required by law</Text>
          <Text style={styles.bulletPoint}>• Other users (only public profile information)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your information, including:
          </Text>
          <Text style={styles.bulletPoint}>• Encrypted data transmission</Text>
          <Text style={styles.bulletPoint}>• Secure Firebase storage</Text>
          <Text style={styles.bulletPoint}>• Regular security audits</Text>
          <Text style={styles.bulletPoint}>• Access controls and authentication</Text>
          <Text style={styles.paragraph}>
            However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal information</Text>
          <Text style={styles.bulletPoint}>• Update or correct your data</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your account</Text>
          <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Export your data</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us at support@biasharareview.co.tz
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Authentication Services</Text>
          <Text style={styles.paragraph}>
            We use third-party authentication services (Google, Facebook) to help you sign in. When you use these services, you authorize us to access certain information from your account as permitted by that service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children&apos;s Privacy</Text>
          <Text style={styles.paragraph}>
            Our app is not intended for users under 13 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </Text>
          <Text style={styles.bulletPoint}>• Email: support@biasharareview.co.tz</Text>
          <Text style={styles.bulletPoint}>• Address: Dar es Salaam, Tanzania</Text>
          <Text style={styles.bulletPoint}>• Phone: +255 XXX XXX XXX</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using BiasharaReview, you agree to this Privacy Policy and our Terms of Service.
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
    paddingBottom: 40,
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
  lastUpdated: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 24,
    marginLeft: 8,
    marginBottom: 8,
  },
  footer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 20,
    textAlign: 'center',
  },
});
