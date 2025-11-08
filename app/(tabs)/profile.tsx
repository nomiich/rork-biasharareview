import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LogOut,
  User as UserIcon,
  ChevronRight,
  Building2,
  Plus,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Settings,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <UserIcon size={32} color={Colors.light.primary} />
            </View>
            <Text style={styles.userName}>Guest User</Text>
            <Text style={styles.userEmail}>Sign in to access all features</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={styles.signInButtonText}>Sign In to Continue</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Sign In?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MessageSquare size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Write and manage reviews</Text>
              </View>
              <View style={styles.featureItem}>
                <Heart size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Save favorite businesses</Text>
              </View>
              <View style={styles.featureItem}>
                <Building2 size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Claim and manage your business</Text>
              </View>
              <View style={styles.featureItem}>
                <LayoutDashboard size={20} color={Colors.light.primary} />
                <Text style={styles.featureText}>Track your contributions</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/contact' as any)}>
              <View style={styles.menuItemLeft}>
                <HelpCircle size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Contact Support</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/terms' as any)}>
              <View style={styles.menuItemLeft}>
                <FileText size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/privacy' as any)}>
              <View style={styles.menuItemLeft}>
                <FileText size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.muted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.profileHeader}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user?.name.charAt(0) || 'U'}</Text>
            </View>
          )}
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.reviewsCount || 0}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.favorites.length || 0}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/user-dashboard' as any)}
          >
            <LayoutDashboard size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>My Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/plans' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Plus size={20} color={Colors.light.primary} />
              <Text style={styles.menuItemText}>Add New Listing</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.muted} />
          </TouchableOpacity>

          {user.ownedEntityIds && user.ownedEntityIds.length > 0 && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/dashboard' as any)}
            >
              <View style={styles.menuItemLeft}>
                <Building2 size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Entity Dashboard</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.muted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Settings size={20} color={Colors.light.primary} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/contact' as any)}>
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color={Colors.light.primary} />
              <Text style={styles.menuItemText}>Contact Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/terms' as any)}>
            <View style={styles.menuItemLeft}>
              <FileText size={20} color={Colors.light.primary} />
              <Text style={styles.menuItemText}>Terms of Service</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/privacy' as any)}>
            <View style={styles.menuItemLeft}>
              <FileText size={20} color={Colors.light.primary} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={Colors.light.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  signInButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  featuresList: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
});
