// Interface Implementation
export default interface User {
  userId: number;
  email: string;
  username: string;
  password: string;
}

// hash user password
// userSchema.pre('save', async function (next) {
//   if (this.isNew || this.isModified('password')) {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }

//   next();
// });

// custom method to compare and validate password for logging in
// userSchema.methods.isCorrectPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };