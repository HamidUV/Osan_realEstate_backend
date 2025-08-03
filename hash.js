import bcrypt from 'bcryptjs';


const plainTextPassword = "OsanGroup";
const saltRounds = 10;

bcrypt.hash(plainTextPassword, saltRounds).then((hash) => {
  console.log('Hashed password:', hash);
});