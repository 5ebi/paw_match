import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import BackButton from '../../components/BackButton';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

interface FormErrors {
  email?: string;
  submit?: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  requiresVerification?: boolean;
}

const ELEMENT_WIDTH = 330;

const errorBannerShadow =
  Platform.OS === 'web'
    ? ({ boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.12)' } as const)
    : {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
      };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text,
    width: ELEMENT_WIDTH,
    fontSize: 14,
    opacity: 0.8,
  },
  input: {
    backgroundColor: colors.green,
    marginBottom: 4,
    width: ELEMENT_WIDTH,
  },
  inputGroup: {
    marginBottom: 6,
    width: ELEMENT_WIDTH,
  },
  errorBanner: {
    marginTop: 14,
    width: ELEMENT_WIDTH,
    backgroundColor: colors.white,
    borderLeftColor: colors.brown,
    borderLeftWidth: 4,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...errorBannerShadow,
  },
  errorBannerText: {
    color: colors.black2,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  helperText: {
    color: colors.white2,
    width: ELEMENT_WIDTH,
  },
  buttonsContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: ELEMENT_WIDTH,
    padding: 3,
    marginBottom: 10,
    backgroundColor: colors.text,
  },
});

const inputTheme = {
  colors: {
    onSurfaceVariant: colors.white2,
    onSurface: colors.white,
  },
};

export default function RegisterEmail() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateEmail = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateEmail()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as ApiResponse;

      if (data.requiresVerification) {
        // Email exists but not verified, go to verification
        router.push({
          pathname: '/registerVerify',
          params: { email, isExisting: 'true' },
        });
      } else if (data.error) {
        // Email already exists and verified - redirect to login
        router.push({
          pathname: '/login',
          params: { email },
        });
      } else if (response.ok) {
        // Email is available, proceed to verification
        router.push({
          pathname: '/registerVerify',
          params: { email },
        });
      }
    } catch (error) {
      const err = error as Error;
      setErrors((prev) => ({
        ...prev,
        submit: `Error: ${err.message || 'Unknown error'}`,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FullPageContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={20}
        >
          <View style={styles.container}>
            <BackButton />

            <View style={styles.topSection}>
              <View style={styles.headerContainer}>
                <H1>Register</H1>
              </View>

              <Text style={styles.description}>
                Let's find the perfect playmate for your dog. Please enter your
                email address to get started.
              </Text>

              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  outlineColor={colors.white2}
                  textColor={colors.white}
                  activeOutlineColor={colors.white}
                  style={styles.input}
                  theme={inputTheme}
                  error={!!errors.email}
                />
                {errors.email && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.email}
                  </HelperText>
                )}
              </View>

              {errors.submit && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errors.submit}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              onPress={handleSubmit}
              style={styles.button}
              mode="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Checking...' : 'Continue'}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </FullPageContainer>
    </>
  );
}
