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

interface FormErrors {
  postal_code?: string;
}

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

const ELEMENT_WIDTH = 330;

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

export default function RegisterPostalCode() {
  const [postalCode, setPostalCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { email, name } = useLocalSearchParams<{
    email?: string;
    name?: string;
  }>();

  const validatePostalCode = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!postalCode) {
      newErrors.postal_code = 'Postal code is required';
    } else if (
      !VALID_POSTAL_CODES.includes(postalCode as ValidPostalCode)
    ) {
      newErrors.postal_code = 'Please enter a valid Vienna postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [postalCode]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validatePostalCode()) return;

    setIsSubmitting(true);

    try {
      router.push({
        pathname: '/registerPassword',
        params: { email, name, postal_code: postalCode },
      });
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
              <H1>Where are you located?</H1>
            </View>

            <Text style={styles.description}>
              We use this to find matches in your area
            </Text>

            <View style={styles.inputGroup}>
              <TextInput
                mode="outlined"
                label="Vienna postal code"
                value={postalCode}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text)) {
                    setPostalCode(text);
                    if (errors.postal_code) {
                      setErrors((prev) => ({
                        ...prev,
                        postal_code: undefined,
                      }));
                    }
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                outlineColor={colors.white2}
                textColor={colors.white}
                activeOutlineColor={colors.white}
                style={styles.input}
                theme={inputTheme}
                error={!!errors.postal_code}
              />
              {errors.postal_code && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.postal_code}
                </HelperText>
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
              {isSubmitting ? 'Continuing...' : 'Continue'}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </FullPageContainer>
  );
}
