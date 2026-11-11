// Uso: npm run hash-password -- "sua-senha"
// Imprime o valor para ADMIN_PASSWORD_HASH.
import { hashPassword } from "../lib/password";

const password = process.argv[2];

if (!password || password.length < 8) {
  console.error('Uso: npm run hash-password -- "senha-com-8-ou-mais-caracteres"');
  process.exit(1);
}

console.log(hashPassword(password));
