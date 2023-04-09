// Class Implementation
export default class User {
    public userId: number;
    public email: string; 
    public username: string;
    public password: string;
  }


const { Models, DataTypes } = require('sequelize');
const Users = require('./user');
const sequelize = require('../db/connection');
const comments = require('./comments');

class Posts extends Model {}

Posts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    article: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'posts',
  }
);


module.exports = Posts;