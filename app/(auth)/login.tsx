import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { sessionStorage } from '../../util/sessionStorage';

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
  successBanner: {
    marginTop: 14,
    width: ELEMENT_WIDTH,
    backgroundColor: colors.white,
    borderLeftColor: colors.green,
    borderLeftWidth: 4,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...errorBannerShadow,
  },
  successBannerText: {
    color: colors.green,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  helperText: {
    color: colors.white2,
    width: ELEMENT_WIDTH,
  },
  forgotPasswordContainer: {
    width: ELEMENT_WIDTH,
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
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

const Login: React.FC = () => {
  const { email: paramEmail, reset } = useLocalSearchParams<{
    email?: string;
    reset?: string;
  }>();
  const [formData, setFormData] = useState({
    email: paramEmail || '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const passwordInputRef = useRef<any>(null);
  const showResetSuccess = reset === 'success';

  // Focus password field if email is prefilled
  useEffect(() => {
    if (paramEmail && passwordInputRef.current) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 300);
    }
  }, [paramEmail]);

  const handleChange = useCallback(
    (field: 'email' | 'password', value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await sessionStorage.setSession(data.token);
        router.push('/');
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.error || 'Login failed',
        }));
        if (data.needsVerification) {
          router.push({
            pathname: '/verify',
            params: { reason: 'existing' },
          });
        }
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: 'An unexpected error occurred.',
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
                <H1>Log in</H1>
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
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

              <View style={styles.inputGroup}>
                <TextInput
                  ref={passwordInputRef}
                  mode="outlined"
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                  outlineColor={colors.white2}
                  textColor={colors.white}
                  activeOutlineColor={colors.white}
                  style={styles.input}
                  theme={inputTheme}
                  error={!!errors.password}
                />
                {errors.password && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.password}
                  </HelperText>
                )}
              </View>

              <View style={styles.forgotPasswordContainer}>
                <Text
                  style={styles.forgotPasswordText}
                  onPress={() =>
                    router.push({
                      pathname: '/forgotPassword',
                      params: formData.email
                        ? { email: formData.email }
                        : undefined,
                    })
                  }
                >
                  Forgot password?
                </Text>
              </View>

              {showResetSuccess && (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerText}>
                    Password updated. Please log in with your new password.
                  </Text>
                </View>
              )}

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
              {isSubmitting ? 'Submitting...' : 'Log In'}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </FullPageContainer>

    </>
  );
};

export default Login;
