import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    userRole: {
      type: Number,
      required: true
    }
  }, {
    timestamps: true
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(await bcrypt.compare(enteredPassword, this.password))
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function( next) {
  if(!this.isModified('password')) {
    next();
  }
  //this two line will be executed at user creation and update user if password get changed.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);
export default User;
