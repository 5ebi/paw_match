import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <FullPageContainer>
      <H1>Register</H1>

      <Link href="/verify" asChild>
        <Button
          style={{ alignSelf: 'center', width: 332, marginBottom: 10 }}
          textColor={colors.text}
          mode="outlined"
        >
          Sign Up
        </Button>
        <TextInput
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </Link>
    </FullPageContainer>
  );
}
