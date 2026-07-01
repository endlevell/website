import { hashAdminPassword } from '../src/lib/auth/password';

const password = process.argv.slice(2).join(' ');

if (!password) {
  console.error('Usage: npm run auth:hash -- "your password"');
  process.exit(1);
}

const hash = await hashAdminPassword(password);
console.log(hash.replaceAll('$', '\\$'));
