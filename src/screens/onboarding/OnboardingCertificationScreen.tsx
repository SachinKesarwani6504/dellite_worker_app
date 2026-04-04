import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, Text, View } from 'react-native';
import { getWorkerStatus } from '@/actions';
import { BackButton } from '@/components/common/BackButton';
import { useBrandRefreshControlProps } from '@/components/common/BrandRefreshControl';
import { Button } from '@/components/common/Button';
import { GradientScreen } from '@/components/common/GradientScreen';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingStackParamList } from '@/types/navigation';
import { WorkerStatusCertificateItem } from '@/types/auth';
import { titleCase } from '@/utils';
import { APP_TEXT } from '@/utils/appText';
import { APP_LAYOUT } from '@/utils/layout';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingCertification'>;

function formatStatusTitle(status?: string): string {
  return titleCase(status ?? 'PENDING');
}

export function OnboardingCertificationScreen({ navigation }: Props) {
  const { onboardingRoute, refreshMe, loading } = useAuth();
  const { modeKey, refreshProps } = useBrandRefreshControlProps();
  const [screenLoading, setScreenLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requiredCertificates, setRequiredCertificates] = useState<WorkerStatusCertificateItem[]>([]);

  const loadCertificates = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setScreenLoading(true);
      } else {
        setRefreshing(true);
      }
      const status = await getWorkerStatus();
      const certificates = Array.isArray(status?.requiredCertificates)
        ? status.requiredCertificates
        : [];
      setRequiredCertificates(certificates);
    } finally {
      setScreenLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates(true);
  }, [loadCertificates]);

  const onBackStep = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const onRefresh = useCallback(() => {
    if (loading || screenLoading) return;
    void Promise.all([refreshMe(), loadCertificates(false)]);
  }, [loadCertificates, loading, refreshMe, screenLoading]);

  useEffect(() => {
    if (onboardingRoute === 'OnboardingWelcome') {
      navigation.replace('OnboardingWelcome');
      return;
    }
    if (onboardingRoute === 'OnboardingVehicle') {
      navigation.replace('OnboardingVehicle');
    }
  }, [navigation, onboardingRoute]);

  const onContinue = async () => {
    await refreshMe();
  };

  return (
    <GradientScreen
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 18, paddingHorizontal: APP_LAYOUT.screenHorizontalPadding }}
      refreshControl={(
        <RefreshControl
          key={modeKey}
          refreshing={refreshing}
          onRefresh={onRefresh}
          {...refreshProps}
        />
      )}
    >
      <View className="rounded-3xl bg-white px-4 pb-5 pt-4 dark:bg-[#161616]">
        <BackButton onPress={onBackStep} visible={navigation.canGoBack()} />
        <Text className="mt-3 text-xs font-bold tracking-widest text-brandOrange">{APP_TEXT.onboarding.certification.step}</Text>
        <Text className="mt-2 text-4xl font-extrabold leading-[40px] text-brandBlack dark:text-white">
          {APP_TEXT.onboarding.certification.title}
        </Text>
        <Text className="mt-2 text-sm text-[#6E6E77] dark:text-[#B5B5BD]">
          {APP_TEXT.onboarding.certification.subtitle}
        </Text>

        {screenLoading ? (
          <View className="mt-8 items-center justify-center">
            <ActivityIndicator size="large" color="#FF7A00" />
          </View>
        ) : (
          <View className="mt-4">
            {requiredCertificates.length === 0 ? (
              <View className="rounded-2xl border border-brandYellow/40 bg-brandCream/40 p-4 dark:border-white/10 dark:bg-[#1D1D1D]">
                <Text className="text-sm font-semibold text-brandBlack dark:text-white">
                  {APP_TEXT.onboarding.certification.noCertificateText}
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {requiredCertificates.map((item, index) => (
                  <View key={`${item.workerServiceId ?? 'certificate'}-${index}`} className="rounded-2xl border border-brandYellow/40 bg-white p-4 dark:border-white/10 dark:bg-[#1D1D1D]">
                    <Text className="text-base font-bold text-brandBlack dark:text-white">{item.title ?? 'Certificate'}</Text>
                    {!!item.description && (
                      <Text className="mt-1 text-xs text-[#6E6E77] dark:text-[#B5B5BD]">{item.description}</Text>
                    )}
                    <View className="mt-3 flex-row items-center justify-between">
                      <Text className="text-xs font-semibold tracking-wider text-brandOrange">
                        {formatStatusTitle(item.certificateStatus)}
                      </Text>
                      <Pressable className="rounded-lg border border-brandOrange/40 bg-brandOrange/10 px-3 py-1.5">
                        <Text className="text-xs font-semibold text-brandOrange">
                          {item.buttonText ?? 'Upload Certificate'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      <View className="mt-4">
        <Button label={APP_TEXT.onboarding.certification.continueButton} onPress={onContinue} loading={loading} />
      </View>
    </GradientScreen>
  );
}
