import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { ResendVerificationButton } from '../../components/ResendVerificationButton';
import { colors } from '../../constants/colors';

interface VerifyResponse {
  message?: string;
  error?: string;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    width: 332,
    height: 50,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: colors.text,
  },
  status: {
    marginTop: 10,
    textAlign: 'center',
  },
  resendContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    width: 332,
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'center',
    width: 332,
    marginTop: 20,
  },
  messageText: {
    color: colors.text,
    marginBottom: 10,
  },
});

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
      <H1>Verify Your Email</H1>

      <View style={styles.container}>
        <Text style={styles.description}>
          Please enter the verification code sent to your email address or click
          the verification link in the email.
        </Text>

        <TextInput
          style={styles.input}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="Enter verification code"
          autoCapitalize="none"
        />

        <Button
          loading={isLoading}
          style={styles.button}
          textColor={colors.text}
          mode="outlined"
          onPress={() => handleVerification(verificationCode)}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        {status && (
          <Text
            style={[
              styles.status,
              {
                color: status.includes('success') ? colors.green : colors.brown,
              },
            ]}
          >
            {status}
          </Text>
        )}

        <View style={styles.resendContainer}>
          <Text style={styles.messageText}>Didn't receive the code?</Text>
          {email && <ResendVerificationButton email={email} />}
        </View>

        <Link href="/login" asChild>
          <Button style={styles.backButton} textColor={colors.text} mode="text">
            Back to Login
          </Button>
        </Link>
      </View>
    </FullPageContainer>
  );
}
