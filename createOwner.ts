import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createNewOwner() {
  try {
    const newOwner = await prisma.owners.create({
      data: {
        name: 'Sebastian',
        email: 'sebastian@example.com',
        password: 'securepassword123',
        postal_code: '12345',
      },
    });
    console.log('New Owner:', newOwner);
  } catch (error) {
    console.error('Error creating owner:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Der Aufruf wird mit .catch behandelt, um sicherzustellen, dass keine "floating promises" auftreten
createNewOwner().catch((error) => {
  console.error('Unhandled error in createNewOwner:', error);
});
