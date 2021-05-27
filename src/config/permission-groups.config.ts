import dotenv from 'dotenv';
dotenv.config();

export default {
  defaultGroups: [
    { name: process.env.DEFAULT_PERMISSION_GROUP, level: 0 },
    { name: process.env.DEFAULT_ADMIN_PERMISSION_GROUP, level: 1 },
  ],
};
