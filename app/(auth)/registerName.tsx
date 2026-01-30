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
  name?: string;
}

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

export default function RegisterName() {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const validateName = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name]);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validateName()) return;

    setIsSubmitting(true);

    try {
      router.push({
        pathname: '/registerPostalCode',
        params: { email, name },
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
              <H1>What's your name?</H1>
            </View>

            <Text style={styles.description}>
              This helps us personalize your experience
            </Text>

            <View style={styles.inputGroup}>
              <TextInput
                mode="outlined"
                label="Your name"
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
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
