const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Use bcrypt for password hashing

const users = [
  {
    username: 'parent1',
    email: 'parent1@example.com',
    password: 'password123',
    role: 'parent',
    children: [
      {
        firstName: 'Alex',
        lastName: 'Smith',
        dateOfBirth: new Date('2012-05-15'),
        interests: ['sports', 'nature', 'art'],
        medicalNotes: 'Mild peanut allergy'
      },
      {
        firstName: 'Emma',
        lastName: 'Smith',
        dateOfBirth: new Date('2014-09-20'),
        interests: ['music', 'swimming', 'coding'],
        medicalNotes: 'No known allergies'
      }
    ]
  },
  {
    username: 'parent2',
    email: 'parent2@example.com',
    password: 'password123',
    role: 'parent',
    children: [
      {
        firstName: 'Noah',
        lastName: 'Johnson',
        dateOfBirth: new Date('2011-03-10'),
        interests: ['science', 'robotics', 'hiking'],
        medicalNotes: 'Requires inhaler for asthma'
      }
    ]
  },
  {
    username: 'campowner1',
    email: 'campowner1@example.com',
    password: 'password123',
    role: 'camp_owner'
  },
  {
    username: 'campowner2',
    email: 'campowner2@example.com',
    password: 'password123',
    role: 'camp_owner'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  }
];

const seedUsers = async () => {
    try {
      // Insert users into database
      const createdUsers = await User.insertMany(users);
      console.log(`${createdUsers.length} users created`);
      
      // Return the created users for use in other seed files
      return createdUsers;
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error; // Re-throw to be caught by the main error handler
    }
  };

module.exports = seedUsers;