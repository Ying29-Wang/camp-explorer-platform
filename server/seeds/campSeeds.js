const Camp = require('../models/camp');

const CAMP_CATEGORIES = Camp.CATEGORIES;

const camps = [
  {
    name: 'Adventure Wilderness Camp',
    description: 'An outdoor adventure camp focused on survival skills, hiking, and nature exploration.',
    location: 'Boulder, Colorado',
    ageRange: {
      min: 8,
      max: 14
    },
    category: 'Adventure',
    activities: ['Hiking', 'Kayaking', 'Rock Climbing', 'Survival Skills'],
    price: 450,
    image: ['https://example.com/adventure-camp.jpg'],
    source: 'direct',
    website: 'https://example.com/adventure-camp',
    contact: 'John Doe',
    email: 'info@adventurecamp.com',
    phone: '303-555-1234',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-06-30'),
    capacity: 60,
    registered: 45
  },
  {
    name: 'Tech Innovation Camp',
    description: 'A coding and robotics camp where kids learn programming, robotics, and app development.',
    location: 'Austin, Texas',
    ageRange: {
      min: 10,
      max: 16
    },
    category: 'Technology',
    activities: ['Coding', 'Robotics', 'App Development', '3D Printing'],
    price: 550,
    image: ['https://example.com/tech-camp.jpg'],
    source: 'direct',
    website: 'https://example.com/tech-camp',
    contact: 'Jane Smith',
    email: 'info@techcamp.com',
    phone: '512-555-6789',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-21'),
    capacity: 40,
    registered: 35
  },
  {
    name: 'Creative Arts Camp',
    description: 'A camp focused on developing artistic abilities through painting, sculpture, and digital arts.',
    location: 'Portland, Oregon',
    ageRange: {
      min: 7,
      max: 15
    },
    category: 'Arts',
    activities: ['Painting', 'Sculpture', 'Photography', 'Digital Art'],
    price: 400,
    image: ['https://example.com/arts-camp.jpg'],
    source: 'direct',
    website: 'https://example.com/arts-camp',
    contact: 'Emma Wilson',
    email: 'info@artscamp.com',
    phone: '503-555-4321',
    startDate: new Date('2023-07-05'),
    endDate: new Date('2023-07-19'),
    capacity: 35,
    registered: 28
  },
  {
    name: 'Sports Elite Camp',
    description: 'A high-energy sports camp covering multiple sports with professional coaching.',
    location: 'Chicago, Illinois',
    ageRange: {
      min: 9,
      max: 16
    },
    category: 'Sports',
    activities: ['Basketball', 'Soccer', 'Swimming', 'Tennis', 'Track & Field'],
    price: 475,
    image: ['https://example.com/sports-camp.jpg'],
    source: 'direct',
    website: 'https://example.com/sports-camp',
    contact: 'Michael Johnson',
    email: 'info@sportscamp.com',
    phone: '312-555-8765',
    startDate: new Date('2023-06-20'),
    endDate: new Date('2023-07-15'),
    capacity: 75,
    registered: 65
  },
  {
    name: 'Science Explorers Camp',
    description: 'A hands-on science camp featuring experiments, field trips, and STEM activities.',
    location: 'Seattle, Washington',
    ageRange: {
      min: 8,
      max: 14
    },
    category: 'Science',
    activities: ['Lab Experiments', 'Field Research', 'Astronomy', 'Marine Biology'],
    price: 500,
    image: ['https://example.com/science-camp.jpg'],
    source: 'direct',
    website: 'https://example.com/science-camp',
    contact: 'Sarah Chen',
    email: 'info@sciencecamp.com',
    phone: '206-555-2345',
    startDate: new Date('2023-07-24'),
    endDate: new Date('2023-08-04'),
    capacity: 50,
    registered: 40
  }
];

const seedCamps = async () => {
  // Insert camps into database
  const createdCamps = await Camp.insertMany(camps);
  console.log(`${createdCamps.length} camps created`);
  
  // Return the created camps for use in other seed files
  return createdCamps;
};

module.exports = seedCamps;