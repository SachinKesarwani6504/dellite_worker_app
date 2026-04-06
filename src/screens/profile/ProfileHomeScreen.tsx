import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, useColorScheme } from 'react-native';
import { getWorkerStatus } from '@/actions';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuthContext } from '@/contexts/AuthContext';
import { AuthStatus } from '@/types/auth-status';
import { ProfileStackParamList } from '@/types/navigation';
import { PROFILE_SCREENS } from '@/types/screen-names';
import { APP_TEXT } from '@/utils/appText';
import { formatMemberSince } from '@/utils';
import { palette, theme, uiColors } from '@/utils/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, typeof PROFILE_SCREENS.home>;

type ProfileStats = {
  totalSkills: number;
  approvedSkills: number;
  certificates: number;
};

function toDisplayGender(value?: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return 'Not set';
  const normalized = value.trim().toLowerCase();
  if (normalized === 'male') return 'Male';
  if (normalized === 'female') return 'Female';
  if (normalized === 'other') return 'Other';
  return value;
}

export function ProfileHomeScreen({ navigation }: Props) {
  const isDark = useColorScheme() === 'dark';
  const { user, phone, logout, loading, status } = useAuthContext();
  const [stats, setStats] = useState<ProfileStats>({ totalSkills: 0, approvedSkills: 0, certificates: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || APP_TEXT.profile.nameFallback;
  const initials = useMemo(() => {
    const first = String(user?.firstName ?? '').trim().charAt(0).toUpperCase();
    const last = String(user?.lastName ?? '').trim().charAt(0).toUpperCase();
    const value = `${first}${last}`.trim();
    return value || 'DP';
  }, [user?.firstName, user?.lastName]);
  const genderLabel = toDisplayGender(user?.gender);
  const roleLabel = 'Worker';
  const memberSince = formatMemberSince(user?.createdAt);
  const contactPhone = (user?.phone ?? phone) || APP_TEXT.profile.phoneFallback;
  const contactEmail = typeof user?.email === 'string' && user.email.trim() ? user.email : 'Not provided';
  const isVerified = status === AuthStatus.AUTHENTICATED;

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const data = await getWorkerStatus();
        if (!mounted) return;
        const totalSkills = data.summary?.totalSkills ?? (Array.isArray(data.skills) ? data.skills.length : 0);
        const approvedSkills = data.summary?.approvedSkills ?? 0;
        const certificates = Array.isArray(data.certificates) ? data.certificates.length : 0;
        setStats({ totalSkills, approvedSkills, certificates });
      } catch {
        if (!mounted) return;
        setStats({ totalSkills: 0, approvedSkills: 0, certificates: 0 });
      } finally {
        if (mounted) {
          setLoadingStats(false);
        }
      }
    };

    void loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const cardStyle = {
    backgroundColor: isDark ? uiColors.surface.cardDefaultDark : palette.light.card,
    borderColor: isDark ? uiColors.surface.overlayDark14 : uiColors.surface.overlayStrokeLight,
  };
  const mutedCardStyle = {
    backgroundColor: isDark ? uiColors.surface.cardMutedDark : uiColors.surface.trackLight,
    borderColor: isDark ? uiColors.surface.overlayDark10 : uiColors.surface.overlayStrokeLight,
  };

  return (
    <GradientScreen contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}>
      <View className="overflow-hidden rounded-3xl border" style={cardStyle}>
        <LinearGradient
          colors={theme.gradients.cta}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 110 }}
        />

        <View className="items-center px-5 pb-5">
          <View className="-mt-12 relative">
            <View
              className="h-24 w-24 items-center justify-center rounded-full border-4 bg-primary"
              style={{ borderColor: isDark ? theme.colors.baseDark : theme.colors.onPrimary }}
            >
              <Text className="text-3xl font-extrabold" style={{ color: theme.colors.onPrimary }}>{initials}</Text>
            </View>
            {isVerified ? (
              <View
                className="absolute -right-0.5 top-0 h-7 w-7 items-center justify-center rounded-full border-2"
                style={{ borderColor: theme.colors.onPrimary, backgroundColor: theme.colors.accent }}
              >
                <Ionicons name="checkmark" size={14} color={theme.colors.onPrimary} />
              </View>
            ) : null}
            <View
              className="absolute -bottom-0.5 right-1 h-7 w-7 items-center justify-center rounded-full border bg-primary/90"
              style={{ borderColor: theme.colors.onPrimary }}
            >
              <Ionicons name="camera-outline" size={14} color={theme.colors.onPrimary} />
            </View>
          </View>

          <Text className="mt-3 text-center text-[28px] font-extrabold text-baseDark dark:text-white">
            {displayName}
          </Text>

          <View className="mt-2 flex-row items-center gap-2">
            <View className="flex-row items-center rounded-full px-3 py-1" style={mutedCardStyle}>
              <Ionicons name="person-circle-outline" size={13} color={theme.colors.primary} />
              <Text className="ml-1 text-xs font-semibold text-primary">{roleLabel}</Text>
            </View>
            <View className="flex-row items-center rounded-full px-3 py-1" style={mutedCardStyle}>
              <Ionicons name="male-female-outline" size={13} color={isDark ? palette.dark.text : theme.colors.baseDark} />
              <Text className="ml-1 text-xs font-semibold text-textPrimary dark:text-white">{genderLabel}</Text>
            </View>
          </View>

          <Text className="mt-2 text-sm text-textPrimary/70 dark:text-white/70">{memberSince}</Text>

          <Pressable
            onPress={() => navigation.navigate(PROFILE_SCREENS.editProfile)}
            className="mt-4 rounded-full px-6 py-2.5"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="create-outline" size={14} color={theme.colors.onPrimary} />
              <Text className="text-sm font-semibold" style={{ color: theme.colors.onPrimary }}>Edit Profile</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl border p-4" style={cardStyle}>
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/12">
            <Ionicons name="briefcase-outline" size={18} color={theme.colors.primary} />
          </View>
          <Text className="mt-3 text-2xl font-bold text-baseDark dark:text-white">
            {loadingStats ? '...' : stats.totalSkills}
          </Text>
          <Text className="text-xs text-textPrimary/70 dark:text-white/70">Skills</Text>
        </View>

        <View className="flex-1 rounded-2xl border p-4" style={cardStyle}>
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-positive/12">
            <Ionicons name="checkmark-done-outline" size={18} color={theme.colors.positive} />
          </View>
          <Text className="mt-3 text-2xl font-bold text-baseDark dark:text-white">
            {loadingStats ? '...' : stats.approvedSkills}
          </Text>
          <Text className="text-xs text-textPrimary/70 dark:text-white/70">Completed</Text>
        </View>

        <View className="flex-1 rounded-2xl border p-4" style={cardStyle}>
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
            <Ionicons name="ribbon-outline" size={18} color={theme.colors.accent} />
          </View>
          <Text className="mt-3 text-2xl font-bold text-baseDark dark:text-white">
            {loadingStats ? '...' : stats.certificates}
          </Text>
          <Text className="text-xs text-textPrimary/70 dark:text-white/70">Certificates</Text>
        </View>
      </View>

      <View className="mt-4 rounded-2xl border p-4" style={cardStyle}>
        <Text className="text-lg font-bold text-baseDark dark:text-white">Contact Info</Text>
        <View className="mt-3 gap-2">
          <View className="rounded-xl border p-3" style={mutedCardStyle}>
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-textPrimary/70 dark:text-white/70">Phone</Text>
            <Text className="mt-0.5 text-base font-semibold text-baseDark dark:text-white">{contactPhone}</Text>
          </View>
          <View className="rounded-xl border p-3" style={mutedCardStyle}>
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-textPrimary/70 dark:text-white/70">Email</Text>
            <Text className="mt-0.5 text-base font-semibold text-baseDark dark:text-white">{contactEmail}</Text>
          </View>
        </View>
      </View>

      <View className="mt-4 overflow-hidden rounded-2xl border" style={cardStyle}>
        <Pressable
          onPress={() => navigation.navigate(PROFILE_SCREENS.payoutDetails)}
          className="flex-row items-center px-4 py-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-primary/12">
            <Ionicons name="settings-outline" size={18} color={theme.colors.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-baseDark dark:text-white">Settings</Text>
            <Text className="text-xs text-textPrimary/70 dark:text-white/70">Profile and payout preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={isDark ? palette.dark.text : theme.colors.baseDark} />
        </Pressable>

        <View className="h-px" style={{ backgroundColor: isDark ? uiColors.surface.overlayDark10 : uiColors.surface.overlayStrokeLight }} />

        <Pressable
          onPress={() => navigation.navigate(PROFILE_SCREENS.helpSupport)}
          className="flex-row items-center px-4 py-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
            <Ionicons name="help-buoy-outline" size={18} color={theme.colors.accent} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-baseDark dark:text-white">Help & Support</Text>
            <Text className="text-xs text-textPrimary/70 dark:text-white/70">Get support and report issues</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={isDark ? palette.dark.text : theme.colors.baseDark} />
        </Pressable>

        <View className="h-px" style={{ backgroundColor: isDark ? uiColors.surface.overlayDark10 : uiColors.surface.overlayStrokeLight }} />

        <Pressable
          onPress={() => navigation.navigate(PROFILE_SCREENS.allSkills)}
          className="flex-row items-center px-4 py-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-primary/12">
            <Ionicons name="list-outline" size={18} color={theme.colors.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-baseDark dark:text-white">{APP_TEXT.profile.allSkillsButton}</Text>
            <Text className="text-xs text-textPrimary/70 dark:text-white/70">See all registered skills</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={isDark ? palette.dark.text : theme.colors.baseDark} />
        </Pressable>

        <View className="h-px" style={{ backgroundColor: isDark ? uiColors.surface.overlayDark10 : uiColors.surface.overlayStrokeLight }} />

        <Pressable
          onPress={() => {
            void logout();
          }}
          disabled={loading}
          className="flex-row items-center px-4 py-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-negative/12">
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.negative} />
            ) : (
              <Ionicons name="log-out-outline" size={18} color={theme.colors.negative} />
            )}
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-negative">Logout</Text>
            <Text className="text-xs text-textPrimary/70 dark:text-white/70">Sign out from this device</Text>
          </View>
        </Pressable>
      </View>
    </GradientScreen>
  );
}
