import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import BackButton from '../../components/BackButton';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

interface VerifyResponse {
  message?: string;
  error?: string;
}

const ELEMENT_WIDTH = 330;
const ELEMENT_WIDTH2 = 330;

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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 150,
    paddingHorizontal: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text,
    width: ELEMENT_WIDTH2,
    opacity: 1,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.green,
    width: ELEMENT_WIDTH,
    marginBottom: 20,
  },
  status: {
    marginTop: 10,
    textAlign: 'center',
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
  backTextButton: {
    width: ELEMENT_WIDTH,
    marginTop: 10,
  },
  messageText: {
    color: colors.text,
    marginBottom: 10,
  },
});

const inputTheme = {
  colors: {
    onSurfaceVariant: colors.white2,
    onSurface: colors.white,
  },
};

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleVerification = useCallback(
    async (code: string) => {
      try {
        setIsLoading(true);
        setStatus(null);

        const response = await fetch(`/api/verify-email?code=${code}`);
        const data: VerifyResponse = await response.json();

        if (response.ok) {
          setStatus(data.message || 'Email verified successfully!');
          // Redirect to addFirstDog after 2 seconds
          setTimeout(() => {
            router.push('/addFirstDog');
          }, 2000);
        } else {
          setStatus(data.error || 'Verification failed');
        }
      } catch (err) {
        console.error('Error during verification:', err);
        setStatus('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    // Check if we have a code in the URL (from email link)
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');
      if (code) {
        setVerificationCode(code);
        handleVerification(code).catch(console.error);
      }
    }
  }, [handleVerification]);

  return (
    <FullPageContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <View style={styles.container}>
          {/* <BackButton /> */}

          <View style={styles.topSection}>
            <View style={styles.headerContainer}>
              <H1>Verify Your Email</H1>
            </View>

            <Text style={styles.description}>
              Please enter the verification code sent to your email
            </Text>

            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Enter verification code"
              mode="outlined"
              outlineColor={colors.white2}
              textColor={colors.white}
              activeOutlineColor={colors.white}
              theme={inputTheme}
              autoCapitalize="none"
            />

            {status && (
              <Text
                style={[
                  styles.status,
                  {
                    color: status.includes('success')
                      ? colors.green
                      : colors.brown,
                  },
                ]}
              >
                {status}
              </Text>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              loading={isLoading}
              style={styles.button}
              mode="contained"
              onPress={() => handleVerification(verificationCode)}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            {/* <Link href="/welcome" asChild>
            <Button
              style={styles.backTextButton}
              textColor={colors.text}
              mode="text"
            >
              Back
            </Button>
          </Link> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </FullPageContainer>
  );
}
