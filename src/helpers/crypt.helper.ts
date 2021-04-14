import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

const encryptPassword = (password: string) => {
  const encryptedPassword = bcrypt.hashSync(password, salt);
  return encryptedPassword;
};

const checkPassword = (password: string) => {
  const hash = encryptPassword(password);
  return bcrypt.compareSync(password, hash);
};

export default { encryptPassword, checkPassword };
