import type { Guest } from '../migrations/00000-createTableGuests';
import { sql } from './connect';

export const getGuestsInsecure = async () => {
  const guests = await sql<Guest[]>`
    SELECT
      *
    FROM
      guests
  `;
  return guests;
};
