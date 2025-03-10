import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  const saltLayers = 10;

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltLayers, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export default {
  hashPassword,
  comparePassword,
};
