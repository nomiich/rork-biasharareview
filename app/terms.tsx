import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Terms of Service',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.lastUpdated}>Last Updated: January 26, 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using BiasharaReview (&quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App. We reserve the right to modify these terms at any time, and your continued use of the App constitutes acceptance of those changes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            BiasharaReview is a business review and listing platform that allows users to:
          </Text>
          <Text style={styles.bulletPoint}>• Search and discover local businesses</Text>
          <Text style={styles.bulletPoint}>• Submit reviews and ratings</Text>
          <Text style={styles.bulletPoint}>• Claim and manage business listings</Text>
          <Text style={styles.bulletPoint}>• Communicate with business owners via in-app chat</Text>
          <Text style={styles.bulletPoint}>• Access premium features through subscription plans</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          
          <Text style={styles.subsectionTitle}>3.1 Registration</Text>
          <Text style={styles.paragraph}>
            To access certain features, you must create an account. You agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide accurate and complete information</Text>
          <Text style={styles.bulletPoint}>• Maintain the security of your account credentials</Text>
          <Text style={styles.bulletPoint}>• Notify us immediately of any unauthorized access</Text>
          <Text style={styles.bulletPoint}>• Be responsible for all activities under your account</Text>

          <Text style={styles.subsectionTitle}>3.2 Account Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your account if you violate these terms or engage in fraudulent, abusive, or illegal activities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Content and Conduct</Text>
          
          <Text style={styles.subsectionTitle}>4.1 Review Guidelines</Text>
          <Text style={styles.paragraph}>
            When submitting reviews, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide honest, factual, and unbiased reviews</Text>
          <Text style={styles.bulletPoint}>• Base reviews on your genuine experience</Text>
          <Text style={styles.bulletPoint}>• Not post fake, fraudulent, or malicious reviews</Text>
          <Text style={styles.bulletPoint}>• Not accept compensation for positive reviews</Text>
          <Text style={styles.bulletPoint}>• Not review your own business or a competitor&apos;s business</Text>

          <Text style={styles.subsectionTitle}>4.2 Prohibited Content</Text>
          <Text style={styles.paragraph}>
            You may not post content that:
          </Text>
          <Text style={styles.bulletPoint}>• Contains hate speech, discrimination, or harassment</Text>
          <Text style={styles.bulletPoint}>• Includes profanity, threats, or violence</Text>
          <Text style={styles.bulletPoint}>• Violates intellectual property rights</Text>
          <Text style={styles.bulletPoint}>• Contains spam or promotional material (except for claimed listings)</Text>
          <Text style={styles.bulletPoint}>• Includes personal information of others without consent</Text>
          <Text style={styles.bulletPoint}>• Is illegal or encourages illegal activity</Text>

          <Text style={styles.subsectionTitle}>4.3 Content Ownership</Text>
          <Text style={styles.paragraph}>
            You retain ownership of content you submit but grant BiasharaReview a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content within the App and for promotional purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Business Listings</Text>
          
          <Text style={styles.subsectionTitle}>5.1 Claiming a Business</Text>
          <Text style={styles.paragraph}>
            To claim a business listing, you must:
          </Text>
          <Text style={styles.bulletPoint}>• Be an authorized representative of the business</Text>
          <Text style={styles.bulletPoint}>• Provide valid proof of ownership or authorization</Text>
          <Text style={styles.bulletPoint}>• Provide accurate business information</Text>
          <Text style={styles.bulletPoint}>• Keep your listing information up to date</Text>

          <Text style={styles.subsectionTitle}>5.2 Creating New Listings</Text>
          <Text style={styles.paragraph}>
            Users can create new business listings, but:
          </Text>
          <Text style={styles.bulletPoint}>• Information must be accurate and verifiable</Text>
          <Text style={styles.bulletPoint}>• Duplicate listings will be merged or removed</Text>
          <Text style={styles.bulletPoint}>• We reserve the right to edit or remove any listing</Text>

          <Text style={styles.subsectionTitle}>5.3 Business Owner Responsibilities</Text>
          <Text style={styles.paragraph}>
            As a claimed business owner, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Respond professionally to reviews and messages</Text>
          <Text style={styles.bulletPoint}>• Not manipulate ratings or reviews</Text>
          <Text style={styles.bulletPoint}>• Maintain your subscription for premium features</Text>
          <Text style={styles.bulletPoint}>• Comply with all applicable laws and regulations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Subscription and Payments</Text>
          
          <Text style={styles.subsectionTitle}>6.1 Premium Plans</Text>
          <Text style={styles.paragraph}>
            BiasharaReview offers subscription plans with premium features:
          </Text>
          <Text style={styles.bulletPoint}>• Basic Plan (Free): Limited features</Text>
          <Text style={styles.bulletPoint}>• Business Plan (TZS 29,999/month): Full business features</Text>
          <Text style={styles.bulletPoint}>• Enterprise Plan (TZS 79,999/month): Advanced features and priority support</Text>

          <Text style={styles.subsectionTitle}>6.2 Payment Terms</Text>
          <Text style={styles.paragraph}>
            By subscribing to a paid plan, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Pay all applicable fees</Text>
          <Text style={styles.bulletPoint}>• Automatic renewal unless cancelled</Text>
          <Text style={styles.bulletPoint}>• No refunds for partial months</Text>
          <Text style={styles.bulletPoint}>• Price changes with 30 days notice</Text>

          <Text style={styles.subsectionTitle}>6.3 Cancellation</Text>
          <Text style={styles.paragraph}>
            You may cancel your subscription at any time. Your access to premium features will continue until the end of your current billing period.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content, features, and functionality of the App, including but not limited to text, graphics, logos, and software, are owned by BiasharaReview and are protected by copyright, trademark, and other intellectual property laws. You may not:
          </Text>
          <Text style={styles.bulletPoint}>• Copy, modify, or distribute our content</Text>
          <Text style={styles.bulletPoint}>• Use our trademarks without permission</Text>
          <Text style={styles.bulletPoint}>• Reverse engineer or decompile the App</Text>
          <Text style={styles.bulletPoint}>• Create derivative works based on the App</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of the App is also governed by our Privacy Policy. By using BiasharaReview, you consent to our collection, use, and disclosure of your personal information as described in the Privacy Policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            The App may contain links to third-party websites or services (including Google and Facebook authentication). We are not responsible for the content, privacy policies, or practices of any third-party services. Your use of third-party services is at your own risk.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
          </Text>
          <Text style={styles.bulletPoint}>• The App will be uninterrupted or error-free</Text>
          <Text style={styles.bulletPoint}>• Reviews or business information are accurate</Text>
          <Text style={styles.bulletPoint}>• The App will meet your specific requirements</Text>
          <Text style={styles.bulletPoint}>• Any errors will be corrected</Text>
          <Text style={styles.paragraph}>
            YOU USE THE APP AT YOUR OWN RISK. WE ARE NOT RESPONSIBLE FOR ANY DAMAGES ARISING FROM YOUR USE OF THE APP.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BIASHARAREVIEW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
          </Text>
          <Text style={styles.paragraph}>
            Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim, or TZS 100,000, whichever is greater.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify and hold harmless BiasharaReview, its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
          </Text>
          <Text style={styles.bulletPoint}>• Your use of the App</Text>
          <Text style={styles.bulletPoint}>• Your violation of these Terms</Text>
          <Text style={styles.bulletPoint}>• Your content or conduct</Text>
          <Text style={styles.bulletPoint}>• Your violation of any third-party rights</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Dispute Resolution</Text>
          <Text style={styles.paragraph}>
            Any disputes arising from these Terms or your use of the App shall be resolved through:
          </Text>
          <Text style={styles.bulletPoint}>• First, informal negotiation with our support team</Text>
          <Text style={styles.bulletPoint}>• If unresolved, binding arbitration in Dar es Salaam, Tanzania</Text>
          <Text style={styles.bulletPoint}>• Governed by the laws of Tanzania</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Modifications to the Service</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify, suspend, or discontinue any part of the App at any time without notice. We are not liable to you or any third party for any modification, suspension, or discontinuation of the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of the United Republic of Tanzania, without regard to its conflict of law provisions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us:
          </Text>
          <Text style={styles.bulletPoint}>• Email: support@biasharareview.co.tz</Text>
          <Text style={styles.bulletPoint}>• Address: Dar es Salaam, Tanzania</Text>
          <Text style={styles.bulletPoint}>• Phone: +255 XXX XXX XXX</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using BiasharaReview, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
