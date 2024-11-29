import {
  ActivityLevel,
  DogSize,
  PostalCode,
  PrismaClient,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const dogNames = [
  'Luna',
  'Rocky',
  'Bella',
  'Max',
  'Lucy',
  'Charlie',
  'Daisy',
  'Cooper',
  'Milo',
  'Bailey',
];
const ownerNames = [
  'Anna',
  'Ben',
  'Clara',
  'David',
  'Emma',
  'Felix',
  'Greta',
  'Hans',
  'Ida',
  'Jan',
];

const sizeValues = [DogSize.SMALL, DogSize.MEDIUM, DogSize.LARGE];
const activityValues = [
  ActivityLevel.LOW,
  ActivityLevel.MODERATE,
  ActivityLevel.HIGH,
];

async function main() {
  for (const code of Object.values(PostalCode)) {
    // 4 Owner mit einem Hund
    for (let i = 0; i < 4; i++) {
      const dogName = dogNames[i] ?? 'DefaultDog';
      const size = sizeValues[i % 3] ?? DogSize.MEDIUM;
      const activity = activityValues[i % 3] ?? ActivityLevel.MODERATE;

      await prisma.owner.create({
        data: {
          name: `${ownerNames[i]}_${code}`,
          email: `single${i}@${code.toLowerCase()}.at`,
          password: await bcrypt.hash('test123', 10),
          postalCode: code as PostalCode,
          verified: true,
          dogs: {
            create: [
              {
                name: dogName,
                size: size,
                activityLevel: activity,
                birthDate: new Date(2020 + i, 1, 1),
                preferences: {
                  create: {
                    prefersSmallDogs: true,
                    prefersMediumDogs: true,
                    prefersLargeDogs: true,
                    prefersPuppy: true,
                    prefersYoung: true,
                    prefersAdult: true,
                    prefersSenior: true,
                  },
                },
              },
            ],
          },
        },
      });
    }

    // 2 Owner mit zwei Hunden
    for (let i = 0; i < 2; i++) {
      await prisma.owner.create({
        data: {
          name: `${ownerNames[i + 4]}_${code}`,
          email: `double${i}@${code.toLowerCase()}.at`,
          password: await bcrypt.hash('test123', 10),
          postalCode: code as PostalCode,
          verified: true,
          dogs: {
            create: [
              {
                name: dogNames[i + 4] ?? 'DefaultDog1',
                size: sizeValues[i % 3] ?? DogSize.MEDIUM,
                activityLevel: activityValues[i % 3] ?? ActivityLevel.MODERATE,
                birthDate: new Date(2020 + i, 1, 1),
                preferences: {
                  create: {
                    prefersSmallDogs: true,
                    prefersMediumDogs: true,
                    prefersLargeDogs: true,
                    prefersPuppy: true,
                    prefersYoung: true,
                    prefersAdult: true,
                    prefersSenior: true,
                  },
                },
              },
              {
                name: dogNames[i + 5] ?? 'DefaultDog2',
                size: sizeValues[(i + 1) % 3] ?? DogSize.MEDIUM,
                activityLevel:
                  activityValues[(i + 1) % 3] ?? ActivityLevel.MODERATE,
                birthDate: new Date(2021 + i, 1, 1),
                preferences: {
                  create: {
                    prefersSmallDogs: true,
                    prefersMediumDogs: true,
                    prefersLargeDogs: true,
                    prefersPuppy: true,
                    prefersYoung: true,
                    prefersAdult: true,
                    prefersSenior: true,
                  },
                },
              },
            ],
          },
        },
      });
    }
  }
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
