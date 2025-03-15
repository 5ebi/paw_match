// import { PrismaClient } from '@prisma/client';
// import type { VercelRequest, VercelResponse } from '@vercel/node';
// import { z } from 'zod';

// const prisma = new PrismaClient();

// const registerSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   name: z.string().min(1),
// });

// const querySchema = z.object({
//   email: z.string().email(),
// });

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   const { method, url } = req;

//   try {
//     if (url === '/register') {
//       if (method === 'GET') {
//         const parsedQuery = querySchema.safeParse(req.query);
//         if (!parsedQuery.success) {
//           return res.status(400).json({ error: 'Invalid query parameters' });
//         }

//         const { email } = parsedQuery.data;
//         const user = await prisma.owner.findUnique({ where: { email } });
//         return res.status(200).json({ exists: !!user });
//       }

//       if (method === 'POST') {
//         const parsedBody = registerSchema.safeParse(req.body);
//         if (!parsedBody.success) {
//           return res
//             .status(400)
//             .json({ error: 'Invalid input', details: parsedBody.error.errors });
//         }

//         const { email, password, name } = parsedBody.data;

//         const existingUser = await prisma.owner.findUnique({
//           where: { email },
//         });
//         if (existingUser) {
//           return res.status(400).json({ error: 'User already exists' });
//         }

//         const newUser = await prisma.owner.create({
//           data: { email, password, name },
//         });
//         return res.status(201).json(newUser);
//       }
//     }

//     return res.status(404).json({ error: 'Not found' });
//   } catch (error: unknown) {
//     console.error('API Error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
