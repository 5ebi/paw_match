import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  email: string;
}

interface VerificationResponse {
  message?: string;
  error?: string;
}

export function ResendVerificationButton({ email }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: VerificationResponse = await response.json();

      if (response.ok) {
        setMessage(
          data.message || 'Verification email sent! Please check your inbox.',
        );
      } else {
        setMessage(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      console.error('Error sending verification email:', err);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={handleResend}
        title={isLoading ? 'Sending...' : 'Resend Verification Email'}
        disabled={isLoading}
      />
      {message && (
        <Text
          style={{
            marginTop: 10,
            color: message.includes('sent') ? colors.green : colors.brown,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
    </>
  );
}
