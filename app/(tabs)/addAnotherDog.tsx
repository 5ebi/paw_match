import { ActivityLevel, DogSize } from '@prisma/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
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
  previewImageContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: ELEMENT_WIDTH,
    aspectRatio: 4 / 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    if (!date) return 'Select birthday';
    return date.toLocaleDateString('en-US', {
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
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErrors((prev) => ({ ...prev, submit: 'Permission denied' }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const uploadFormData = new FormData();
        uploadFormData.append('file', blob);
        uploadFormData.append('upload_preset', 'pawmatch');

        const uploadResponse = await fetch(
          'https://api.cloudinary.com/v1_1/pawmatch/upload',
          {
            method: 'POST',
            body: uploadFormData,
          },
        );

        const data = (await uploadResponse.json()) as { secure_url?: string };
        if (data.secure_url) {
          setFormData((prev) => ({ ...prev, image: data.secure_url || null }));
          setErrors((prev) => ({ ...prev, image: undefined }));
        } else {
          setErrors((prev) => ({ ...prev, submit: 'Upload failed' }));
        }
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: 'Upload error' }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Dog name is required';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birthdate is required';
    } else if (formData.birthDate > new Date()) {
      newErrors.birthDate = 'Birthdate cannot be in the future';
    }

    if (!formData.image) {
      newErrors.image = 'Please add a photo of your dog';
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
      setErrors((prev) => ({
        ...prev,
        submit: 'Error adding dog',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.green }}
      showsVerticalScrollIndicator={false}
    >
      {/* <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}> */}
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.headerContainer}>
            <H1>Add Dog</H1>
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              mode="outlined"
              label="Dog Name"
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
              {formData.image ? 'Change Photo' : 'Add Dog Photo'}
            </Button>

            {formData.image && (
              <View style={styles.previewImageContainer}>
                <Image
                  source={{ uri: formData.image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            )}
            {errors.image && (
              <HelperText type="error" style={styles.helperText}>
                {errors.image}
              </HelperText>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.helperText, { marginBottom: 8 }]}>Size</Text>
            <SegmentedControl
              values={['Small', 'Medium', 'Large']}
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
              Activity Level
            </Text>
            <SegmentedControl
              values={['Low', 'Moderate', 'High']}
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
                    color: formData.birthDate ? colors.white : colors.white2,
                  },
                ]}
              >
                {formatDate(formData.birthDate)}
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
                    locale="en-US"
                  />
                </View>
                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    onPress={handleCancelDate}
                    style={styles.modalButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleConfirmDate}
                    style={styles.modalButton2}
                  >
                    Confirm
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
              {isSubmitting ? 'Adding...' : 'Add Dog'}
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
