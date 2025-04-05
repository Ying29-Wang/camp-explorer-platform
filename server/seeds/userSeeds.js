const User = require('../models/user');
const bcrypt = require('bcryptjs');

const timestamp = Date.now();

const users = [
  {
    username: `seed_parent1_${timestamp}`,
    email: `seed_parent1_${timestamp}@example.com`,
    password: 'password123',
    role: 'parent',
    isSeedUser: true,
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
    username: `seed_parent2_${timestamp}`,
    email: `seed_parent2_${timestamp}@example.com`,
    password: 'password123',
    role: 'parent',
    isSeedUser: true,
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
    username: `seed_campowner1_${timestamp}`,
    email: `seed_campowner1_${timestamp}@example.com`,
    password: 'password123',
    role: 'camp_owner',
    isSeedUser: true
  },
  {
    username: `seed_campowner2_${timestamp}`,
    email: `seed_campowner2_${timestamp}@example.com`,
    password: 'password123',
    role: 'camp_owner',
    isSeedUser: true
  },
  {
    username: `seed_admin_${timestamp}`,
    email: `seed_admin_${timestamp}@example.com`,
    password: 'password123',
    role: 'admin',
    isSeedUser: true
  }
];

const seedUsers = async () => {
    try {
      // Hash passwords before inserting
      const hashedUsers = await Promise.all(users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      }));

      // Delete only seed users
      await User.deleteMany({ isSeedUser: true });

      // Insert users into database
      const createdUsers = await User.insertMany(hashedUsers);
      console.log(`${createdUsers.length} seed users created`);
      
      // Return the created users for use in other seed files
      return createdUsers;
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  };

module.exports = seedUsers;