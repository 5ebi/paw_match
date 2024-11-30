import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

// TypeScript Interfaces
interface FormData {
  email: string;
  password: string;
  postalCode: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  postalCode?: string;
  name?: string;
  submit?: string;
}

interface ApiResponse {
  user: {
    username: string;
  };
  message: string;
  token: string;
  error?: string;
}

const ELEMENT_WIDTH = 330;

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
    alignItems: 'center', // Zentriert alle Kinder horizontal
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center', // Zentriert den Header-Text
  },
  input: {
    backgroundColor: colors.green,
    marginBottom: 4,
    width: ELEMENT_WIDTH,
  },
  inputGroup: {
    marginBottom: 6,
    width: ELEMENT_WIDTH, // Gleiche Breite wie Inputs
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    width: ELEMENT_WIDTH,
    textAlign: 'center',
  },
  helperText: {
    color: colors.white2,
    width: ELEMENT_WIDTH,
  },
  buttonsContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
    alignItems: 'center', // Zentriert den Button
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

// Wiener Postleitzahlen als Literal Type
const VALID_POSTAL_CODES = [
  '1010',
  '1020',
  '1030',
  '1040',
  '1050',
  '1060',
  '1070',
  '1080',
  '1090',
  '1100',
  '1110',
  '1120',
  '1130',
  '1140',
  '1150',
  '1160',
  '1170',
  '1180',
  '1190',
  '1200',
  '1210',
  '1220',
  '1230',
] as const;

type ValidPostalCode = (typeof VALID_POSTAL_CODES)[number];

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    postalCode: '',
    name: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else if (
      !VALID_POSTAL_CODES.includes(formData.postalCode as ValidPostalCode)
    ) {
      newErrors.postalCode = 'Please enter a valid Vienna postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
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

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      const data = JSON.parse(text) as ApiResponse;

      if (response.ok && data.token) {
        await sessionStorage.setSession(data.token);
        router.push('/verify');
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

              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Name"
                  value={formData.name}
                  onChangeText={(value) => handleChange('name', value)}
                  outlineColor={colors.white2}
                  textColor={colors.white}
                  activeOutlineColor={colors.white}
                  style={styles.input}
                  theme={inputTheme}
                  error={!!errors.name}
                />
                {errors.name && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.name}
                  </HelperText>
                )}
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
                  mode="outlined"
                  label="Postal Code"
                  value={formData.postalCode}
                  onChangeText={(text) => {
                    if (/^\d*$/.test(text)) handleChange('postalCode', text);
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                  outlineColor={colors.white2}
                  textColor={colors.white}
                  activeOutlineColor={colors.white}
                  style={styles.input}
                  theme={inputTheme}
                  error={!!errors.postalCode}
                />
                {errors.postalCode && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.postalCode}
                  </HelperText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <TextInput
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

              {errors.submit && (
                <Text style={styles.errorText}>{errors.submit}</Text>
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
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </FullPageContainer>
    </>
  );
};

export default Register;
