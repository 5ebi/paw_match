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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import BackButton from '../../components/BackButton';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
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
    lineHeight: 20,
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

export default function ResetPassword() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!token) {
      newErrors.submit = 'Reset link is missing or invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [password, confirmPassword, token]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json()) as ApiResponse;

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push({
            pathname: '/login',
            params: { reset: 'success' },
          });
        }, 3000);
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.error || 'Failed to reset password',
        }));
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
                <H1>Reset Password</H1>
              </View>

              {!submitted ? (
                <>
                  <Text style={styles.description}>
                    Create a new password for your PawMatch account.
                  </Text>

                  <View style={styles.inputGroup}>
                    <TextInput
                      mode="outlined"
                      label="New Password"
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
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

                  <View style={styles.inputGroup}>
                    <TextInput
                      mode="outlined"
                      label="Confirm Password"
                      value={confirmPassword}
                      onChangeText={(value) => {
                        setConfirmPassword(value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      secureTextEntry
                      outlineColor={colors.white2}
                      textColor={colors.white}
                      activeOutlineColor={colors.white}
                      style={styles.input}
                      theme={inputTheme}
                      error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                      <HelperText type="error" style={styles.helperText}>
                        {errors.confirmPassword}
                      </HelperText>
                    )}
                  </View>

                  {errors.submit && (
                    <View style={styles.errorBanner}>
                      <Text style={styles.errorBannerText}>
                        {errors.submit}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerText}>
                    Password updated successfully. You can now log in.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {!submitted && (
            <View style={styles.buttonsContainer}>
              <Button
                onPress={handleSubmit}
                style={styles.button}
                mode="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save New Password'}
              </Button>
            </View>
          )}
        </KeyboardAvoidingView>
      </FullPageContainer>
    </>
  );
}
