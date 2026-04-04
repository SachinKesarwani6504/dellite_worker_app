import { Image, Pressable, Text, useColorScheme, View } from 'react-native';
import Toast from 'react-native-toast-message';

const appIcon = require('../assets/icon.png');

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

type ToastPayload = {
  text1?: string;
};

function getColors(isDark: boolean, variant: ToastVariant) {
  const palette = {
    success: isDark
      ? { backgroundColor: '#241805', borderColor: '#7A4B0A', textColor: '#FFD79A' }
      : { backgroundColor: '#FFF7EA', borderColor: '#FFD38A', textColor: '#7A3E00' },
    error: isDark
      ? { backgroundColor: '#2A1111', borderColor: '#8F2B2B', textColor: '#FFC4C4' }
      : { backgroundColor: '#FFF1F1', borderColor: '#FFB4B4', textColor: '#8C1D1D' },
    info: isDark
      ? { backgroundColor: '#101A34', borderColor: '#2D4F9D', textColor: '#D8E6FF' }
      : { backgroundColor: '#F4F7FF', borderColor: '#BFD0FF', textColor: '#183A8A' },
    warning: isDark
      ? { backgroundColor: '#2A1C07', borderColor: '#9E6A1A', textColor: '#FFE2A6' }
      : { backgroundColor: '#FFF9E8', borderColor: '#FFE08A', textColor: '#8A5A00' },
  };

  return palette[variant];
}

function BrandToast({ text1, variant }: ToastPayload & { variant: ToastVariant }) {
  const isDark = useColorScheme() === 'dark';
  const colors = getColors(isDark, variant);
  const message = text1?.trim() ?? '';

  return (
    <Pressable
      style={{
        marginHorizontal: 24,
        marginTop: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderColor,
        backgroundColor: colors.backgroundColor,
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 64,
        width: '92%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Image source={appIcon} style={{ width: 28, height: 28, borderRadius: 7 }} resizeMode="contain" />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: colors.textColor,
              fontSize: 15,
              fontWeight: '700',
              lineHeight: 20,
              includeFontPadding: false,
              textAlignVertical: 'center',
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export const toastConfig = {
  success: (props: ToastPayload) => <BrandToast {...props} variant="success" />,
  error: (props: ToastPayload) => <BrandToast {...props} variant="error" />,
  info: (props: ToastPayload) => <BrandToast {...props} variant="info" />,
  warning: (props: ToastPayload) => <BrandToast {...props} variant="warning" />,
} as const;

export function showTopToast(type: ToastVariant, message: string) {
  Toast.show({
    type,
    text1: message,
    position: 'top',
    topOffset: 64,
    visibilityTime: 3500,
    autoHide: true,
  });
}

export function showApiSuccessToast(message: string) {
  showTopToast('success', message);
}

export function showApiErrorToast(message: string) {
  showTopToast('error', message);
}

export function showSuccess(message: string) {
  showApiSuccessToast(message);
}

export function showError(message: string) {
  showApiErrorToast(message);
}
