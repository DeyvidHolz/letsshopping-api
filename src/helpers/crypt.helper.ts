import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

const encryptPassword = (password: string) => {
  const encryptedPassword = bcrypt.hashSync(password, salt);
  return encryptedPassword;
};

const checkPassword = (password: string, hashed: string) => {
  return bcrypt.compareSync(password, hashed);
};

export default { encryptPassword, checkPassword };
