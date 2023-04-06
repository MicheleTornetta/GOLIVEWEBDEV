// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class User {
    constructor(
        public name: string, 
        public company: string, 
        public email: string, 
        public phone: string, 
        public street: string, 
        public street2: string, 
        public city: string, 
        public state: string, 
        public zip: number, 
        public login: string, 
        public password: string, 
        public id?: ObjectId) {}
}