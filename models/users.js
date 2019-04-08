
import moment from 'moment';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import hashPassword from '../helperFunctions/hashPassword';

dotenv.config();


class User {
  constructor() {
    this.usersDb = [];
  }

  async createUser(obj) {
    const {
      firstName, lastName, email, password, type,
    } = obj;
    const hashedPassword = await hashPassword(password)
      const newUser = {
        id: this.usersDb.length + 1,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        type,
        createdDate: moment(),
      };
      if(newUser.type == "staff"){
        newUser.isAdmin = obj.isAdmin;
      }
      this.usersDb.push(newUser);
      return newUser;
    
  }


   async login(email, password){
    const user = this.usersDb.find(client => client.email == email);
    if(!user){ return null }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if(verifyPassword){  return user }
    return null
    
  }

  async resetPassword(email){
    const user = this.getAUser(email);
    if(!user){ return null}
    const randomPassword = this.generateRandompassword();
    const updatedUser = await this.updateUser(user.email, randomPassword);
    const details = {randomPassword, updatedUser}
    return details;
    
  }

  getAUser(email) {
    const user = this.usersDb.find(user => user.email == email);
    if(!user){ return null };
    return user
  }

  getAllUsers() {
    return this.usersDb;
  }

  async updateUser(email, newPassword) {
    const user = this.getAUser(email);
    if(!user){ return null }
    const index = this.usersDb.indexOf(user);
    if(!newPassword){ return null }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.updatedDate = moment();
    return this.usersDb[index];
  }

  deleteUser(id) {
    if(!id){ return null}
    const user = this.usersDb.find((client) => client.id == id);
    if(!user){ return null}
    const index = this.usersDb.indexOf(user);
    return this.usersDb.splice(index, 1);
  }

  async generateToken(email){
    const user = this.getAUser(email)
    if(!user){ return null}
    const token = await jsonwebtoken.sign(user, process.env.secret);
      return token;
  }

  decodeToken(token){
    if(!token){ return null}
    try{
      const decodedToken = jsonwebtoken.verify(token, process.env.secret);
    if(decodedToken){ return  decodedToken};
    }catch(err){
      console.log(err)
      return undefined
    }
    
    
  }

  generateRandompassword(){
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    return Array(8).fill(char).map(arr => arr[Math.floor(Math.random() * arr.length)]).join("");
  }


}

export default new User();
