import { ActivityLevel, DogSize } from '@prisma/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import { cloudinaryConfig } from '../../cloudinaryConfig';
import FullPageContainer from '../../components/FullPageContainer';
import H1 from '../../components/H1';
import { colors } from '../../constants/colors';
import { sessionStorage } from '../../util/sessionStorage';

const inputTheme = {
  colors: {
    onSurfaceVariant: colors.white2,
    onSurface: colors.white,
  },
};

interface DogFormData {
  name: string;
  size: DogSize;
  birthDate: Date | null;
  activityLevel: ActivityLevel;
  image: string | null;
}

interface FormErrors {
  name?: string;
  size?: string;
  birthDate?: string;
  activityLevel?: string;
  image?: string;
  submit?: string;
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
  input: {
    backgroundColor: colors.green,
    marginBottom: 4,
    width: ELEMENT_WIDTH,
  },
  inputGroup: {
    marginBottom: 18,
    width: ELEMENT_WIDTH,
  },
  helperText: {
    color: colors.white2,
    width: ELEMENT_WIDTH,
  },
  segmentedButton: {
    width: ELEMENT_WIDTH,
    color: colors.black,
    height: 40,
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
  imageButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    borderColor: colors.white2,
    borderWidth: 1,
    width: ELEMENT_WIDTH,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
  },
  previewImage: {
    width: ELEMENT_WIDTH,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    borderColor: colors.white2,
    borderWidth: 1,
    width: ELEMENT_WIDTH,
    height: 50,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: 20,
    margin: 20,
    borderRadius: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    backgroundColor: colors.green,
  },
  datePickerContainer: {
    backgroundColor: colors.green,
    borderRadius: 8,
    padding: 10,
  },
  modalButton: {
    minWidth: 100,
    borderColor: colors.white2,
  },
  modalButton2: {
    minWidth: 100,
    backgroundColor: colors.white,
  },
});

export default function AddFirstDog() {
  const [formData, setFormData] = useState<DogFormData>({
    name: '',
    size: DogSize.MEDIUM,
    birthDate: null,
    activityLevel: ActivityLevel.MODERATE,
    image: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(1);
  const router = useRouter();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Geburtstag auswählen';
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getSession = async () => {
    const token = await sessionStorage.getSession();
    if (!token) {
      throw new Error('No session found');
    }
    return { token };
  };
  const pickImage = async () => {
    try {
      console.log('Starting image pick...');
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);

      if (status !== 'granted') {
        console.log('Permission denied');
        setErrors((prev) => ({
          ...prev,
          submit: 'Berechtigung zum Zugriff auf die Mediathek verweigert',
        }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // Verwende string literal 'images'
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      console.log('ImagePicker result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0]);

        const uploadFormData = new FormData();
        uploadFormData.append('file', {
          uri: result.assets[0].uri,
          type: 'image/jpeg', // Stelle sicher, dass der MIME-Typ korrekt ist
          name: 'dog.jpg', // Optional: Generiere einen eindeutigen Namen
        } as any);
        uploadFormData.append('upload_preset', 'pawmatch'); // Stelle sicher, dass dies dem Preset-Namen in Cloudinary entspricht

        console.log('Uploading to Cloudinary with preset:', 'pawmatch');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
          {
            method: 'POST',
            body: uploadFormData,
            // **Wichtig**: Entferne den 'Content-Type' Header, wenn du FormData verwendest
            // 'Content-Type': 'multipart/form-data',
          },
        );

        const data = await response.json();
        console.log('Cloudinary response:', data);

        if (response.ok) {
          // Erfolgreicher Upload
          setFormData((prev) => ({
            ...prev,
            image: data.secure_url, // Verwende die sichere URL
          }));
        } else {
          // Fehlerbehandlung
          console.error('Cloudinary Error:', data);
          setErrors((prev) => ({
            ...prev,
            submit: data.error.message || 'Fehler beim Hochladen des Bildes',
          }));
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Ein unerwarteter Fehler ist aufgetreten',
      }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Hundename wird benötigt';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Geburtstag wird benötigt';
    } else if (formData.birthDate > new Date()) {
      newErrors.birthDate = 'Geburtstag kann nicht in der Zukunft liegen';
    }

    if (!formData.image) {
      newErrors.image = 'Bitte füge ein Foto deines Hundes hinzu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: keyof DogFormData, value: string) => {
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    if (tempDate) {
      setFormData((prev) => ({
        ...prev,
        birthDate: tempDate,
      }));
    }
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setTempDate(null);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const session = await getSession();

      const dataToSubmit = {
        ...formData,
        birthDate: formData.birthDate?.toISOString(),
      };

      const response = await fetch('/api/addFirstDog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) throw new Error(await response.text());

      router.push('/allDone');
    } catch (err) {
      console.error('Error:', err);
      setErrors((prev) => ({
        ...prev,
        submit: 'Fehler beim Hinzufügen des Hundes',
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
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={20}
        >
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.headerContainer}>
                <H1>Hund hinzufügen</H1>
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Hundename"
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
                <Button
                  mode="outlined"
                  onPress={pickImage}
                  style={styles.imageButton}
                >
                  {formData.image ? 'Foto ändern' : 'Hundefoto hinzufügen'}
                </Button>

                {formData.image && (
                  <Image
                    source={{ uri: formData.image }}
                    style={styles.previewImage}
                  />
                )}
                {errors.image && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.image}
                  </HelperText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.helperText, { marginBottom: 8 }]}>
                  Größe
                </Text>
                <SegmentedControl
                  values={['Klein', 'Mittel', 'Groß']}
                  selectedIndex={selectedIndex}
                  onChange={(event) => {
                    const index = event.nativeEvent.selectedSegmentIndex;
                    setSelectedIndex(index);
                    const sizeValues: DogSize[] = [
                      DogSize.SMALL,
                      DogSize.MEDIUM,
                      DogSize.LARGE,
                    ];
                    const newSize = sizeValues[index];
                    if (newSize) {
                      setFormData((prev) => ({
                        ...prev,
                        size: newSize,
                      }));
                    }
                  }}
                  style={styles.segmentedButton}
                  appearance="dark"
                  backgroundColor={colors.green}
                  tintColor={colors.white2}
                  activeFontStyle={{ color: colors.white }}
                  fontStyle={{ color: colors.white2 }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.helperText, { marginBottom: 8 }]}>
                  Aktivitätslevel
                </Text>
                <SegmentedControl
                  values={['Entspannt', 'Aktiv', 'Sehr Aktiv']}
                  selectedIndex={selectedActivityIndex}
                  onChange={(event) => {
                    const index = event.nativeEvent.selectedSegmentIndex;
                    setSelectedActivityIndex(index);
                    const activityValues: ActivityLevel[] = [
                      ActivityLevel.LOW,
                      ActivityLevel.MODERATE,
                      ActivityLevel.HIGH,
                    ];
                    const newActivity = activityValues[index];
                    if (newActivity) {
                      setFormData((prev) => ({
                        ...prev,
                        activityLevel: newActivity,
                      }));
                    }
                  }}
                  style={styles.segmentedButton}
                  appearance="dark"
                  backgroundColor={colors.green}
                  tintColor={colors.white2}
                  activeFontStyle={{ color: colors.white }}
                  fontStyle={{ color: colors.white2 }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setTempDate(formData.birthDate || new Date());
                    setShowDatePicker(true);
                  }}
                  style={styles.dateButton}
                >
                  <Text
                    style={[
                      styles.dateText,
                      {
                        color: formData.birthDate
                          ? colors.white
                          : colors.white2,
                      },
                    ]}
                  >
                    {formData.birthDate
                      ? formatDate(formData.birthDate)
                      : 'Geburtstag auswählen'}
                  </Text>
                </Button>

                <Portal>
                  <Modal
                    visible={showDatePicker}
                    onDismiss={handleCancelDate}
                    contentContainerStyle={styles.modalContent}
                  >
                    <View style={styles.datePickerContainer}>
                      <DateTimePicker
                        value={tempDate || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        textColor={colors.white}
                        themeVariant="dark"
                        locale="de-DE"
                      />
                    </View>
                    <View style={styles.modalButtons}>
                      <Button
                        mode="outlined"
                        onPress={handleCancelDate}
                        style={styles.modalButton}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        mode="contained"
                        onPress={handleConfirmDate}
                        style={styles.modalButton2}
                      >
                        Bestätigen
                      </Button>
                    </View>
                  </Modal>
                </Portal>

                {errors.birthDate && (
                  <HelperText type="error" style={styles.helperText}>
                    {errors.birthDate}
                  </HelperText>
                )}
              </View>

              <View style={styles.buttonsContainer}>
                <Button
                  onPress={handleSubmit}
                  style={styles.button}
                  mode="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wird hinzugefügt...' : 'Hund hinzufügen'}
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </FullPageContainer>
    </>
  );
}
