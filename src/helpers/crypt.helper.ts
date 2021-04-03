import bcrypt from 'bcrypt';

const salt = 10;

const encryptPassword = (password: string) => {
  const encryptedPassword = bcrypt.hashSync(password, salt);
  return encryptedPassword;
};

const checkPassword = (password: string, passwordHashed: string) => {
  return bcrypt.compareSync(password, passwordHashed);
};

export default { encryptPassword, checkPassword };