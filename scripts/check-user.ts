import { supabase } from '../supabaseClient';

async function checkUser(email: string) {
  console.log(`Checking for user with email: ${email}`);

  const { data: user, error } = await supabase
    .from('owners')
    .select('id, name, email, verified')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error('Error querying database:', error);
    return;
  }

  if (!user) {
    console.log('❌ No user found with this email');
    console.log('\nTrying to list all users...');

    const { data: allUsers, error: listError } = await supabase
      .from('owners')
      .select('id, name, email, verified')
      .limit(10);

    if (listError) {
      console.error('Error listing users:', listError);
    } else if (allUsers && allUsers.length > 0) {
      console.log('\nExisting users in database:');
      allUsers.forEach(u => {
        console.log(`- ${u.email} (verified: ${u.verified})`);
      });
    } else {
      console.log('No users found in database');
    }
  } else {
    console.log('✅ User found:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Verified: ${user.verified}`);
  }
}

const email = process.argv[2] || 'test@example.com';
checkUser(email).catch(console.error);
