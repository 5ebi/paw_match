import { useLocalSearchParams, useRouter } from 'expo-router';
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
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

interface FormErrors {
  password?: string;
  submit?: string;
}

interface ApiResponse {
  token?: string;
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
    marginBottom: 30,
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
  helperText: {
    color: colors.white2,
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

export default function RegisterPassword() {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { email, name, postal_code } = useLocalSearchParams<{
    email?: string;
    name?: string;
    postal_code?: string;
  }>();

  const validatePassword = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [password]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validatePassword()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/completeRegistration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          postal_code,
          password,
        }),
      });

      const text = await response.text();
      const data = JSON.parse(text) as ApiResponse;

      if (response.ok && data.token) {
        await sessionStorage.setSession(data.token);
        // Redirect to tabs home screen
        router.replace('/(tabs)');
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.error || 'Registration failed',
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
    <FullPageContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <View style={styles.container}>
          <View style={styles.topSection}>
            <View style={styles.headerContainer}>
              <H1>Create a password</H1>
            </View>

            <Text style={styles.description}>
              Keep your account secure with a strong password
            </Text>

            <View style={styles.inputGroup}>
              <TextInput
                mode="outlined"
                label="Password"
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

            {errors.submit && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.submit}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              onPress={handleSubmit}
              style={styles.button}
              mode="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </FullPageContainer>
  );
}
