const Camp = require('../models/camp');
const User = require('../models/user');

const CAMP_CATEGORIES = Camp.CATEGORIES;

const camps = [
  {
    name: 'Adventure Wilderness Camp',
    description: 'An outdoor adventure camp focused on survival skills, hiking, and nature exploration.',
    location: 'Boulder, Colorado',
    coordinates: {
      type: 'Point',
      coordinates: [-105.2705, 40.0150] // Boulder, CO coordinates
    },
    formattedAddress: 'Boulder, Boulder County, Colorado, United States',
    ageRange: {
      min: 8,
      max: 14
    },
    category: 'Adventure',
    activities: ['Hiking', 'Kayaking', 'Rock Climbing', 'Survival Skills'],
    price: 450,
    image: ['https://placehold.co/600x400?text=Adventure+Camp'],
    source: 'direct',
    website: 'https://example.com/adventure-camp',
    contact: 'John Doe',
    email: 'info@adventurecamp.com',
    phone: '303-555-1234',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-06-30'),
    capacity: 60,
    registered: 45,
    status: 'active',
    viewCount: 0,
    isSeedCamp: true
  },
  {
    name: 'Tech Innovation Camp',
    description: 'A coding and robotics camp where kids learn programming, robotics, and app development.',
    location: 'Austin, Texas',
    coordinates: {
      type: 'Point',
      coordinates: [-97.7437, 30.2711] // Austin, TX coordinates
    },
    formattedAddress: 'Austin, Travis County, Texas, United States',
    ageRange: {
      min: 10,
      max: 16
    },
    category: 'Technology',
    activities: ['Coding', 'Robotics', 'App Development', '3D Printing'],
    price: 550,
    image: ['https://placehold.co/600x400?text=Tech+Camp'],
    source: 'direct',
    website: 'https://example.com/tech-camp',
    contact: 'Jane Smith',
    email: 'info@techcamp.com',
    phone: '512-555-6789',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-21'),
    capacity: 40,
    registered: 35,
    status: 'active',
    viewCount: 0,
    isSeedCamp: true
  },
  {
    name: 'Creative Arts Camp',
    description: 'A camp focused on developing artistic abilities through painting, sculpture, and digital arts.',
    location: 'Portland, Oregon',
    coordinates: {
      type: 'Point',
      coordinates: [-122.6765, 45.5155] // Portland, OR coordinates
    },
    formattedAddress: 'Portland, Multnomah County, Oregon, United States',
    ageRange: {
      min: 7,
      max: 15
    },
    category: 'Arts',
    activities: ['Painting', 'Sculpture', 'Photography', 'Digital Art'],
    price: 400,
    image: ['https://placehold.co/600x400?text=Arts+Camp'],
    source: 'direct',
    website: 'https://example.com/arts-camp',
    contact: 'Emma Wilson',
    email: 'info@artscamp.com',
    phone: '503-555-4321',
    startDate: new Date('2023-07-05'),
    endDate: new Date('2023-07-19'),
    capacity: 35,
    registered: 28,
    status: 'active',
    viewCount: 0,
    isSeedCamp: true
  },
  {
    name: 'Sports Elite Camp',
    description: 'A high-energy sports camp covering multiple sports with professional coaching.',
    location: 'Chicago, Illinois',
    coordinates: {
      type: 'Point',
      coordinates: [-87.6298, 41.8781] // Chicago, IL coordinates
    },
    formattedAddress: 'Chicago, Cook County, Illinois, United States',
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
    registered: 65,
    status: 'active',
    viewCount: 0,
    isSeedCamp: true
  },
  {
    name: 'Science Explorers Camp',
    description: 'A hands-on science camp featuring experiments, field trips, and STEM activities.',
    location: 'Seattle, Washington',
    coordinates: {
      type: 'Point',
      coordinates: [-122.3321, 47.6062] // Seattle, WA coordinates
    },
    formattedAddress: 'Seattle, King County, Washington, United States',
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
    registered: 40,
    status: 'active',
    viewCount: 0,
    isSeedCamp: true
  }
];

const seedCamps = async () => {
  try {
    console.log('Starting to seed camps...');
    
    // Get camp owners
    const campOwners = await User.find({ role: 'camp_owner', isSeedUser: true });
    
    // Assign owners to camps if camp owners exist
    const campsToInsert = campOwners.length >= 2 
      ? camps.map((camp, index) => ({
          ...camp,
          owner: campOwners[index % campOwners.length]._id
        }))
      : camps;

    // Clear existing data
    await Camp.deleteMany({ isSeedCamp: true });
    console.log('Cleared existing camp data');

    // Insert camps into database
    console.log('Inserting camps with coordinates...');
    const createdCamps = await Camp.insertMany(campsToInsert);
    console.log(`${createdCamps.length} camps created`);

    // Verify the camps were created with coordinates
    const campsWithCoordinates = await Camp.find({ 'coordinates.coordinates': { $exists: true } });
    console.log(`${campsWithCoordinates.length} camps have coordinates`);

    // Check if geospatial index exists
    const indexes = await Camp.collection.indexes();
    const hasGeospatialIndex = indexes.some(index => 
      index.key && index.key.coordinates === '2dsphere'
    );
    console.log('Has geospatial index:', hasGeospatialIndex);
    
    // Return the created camps for use in other seed files
    return createdCamps;
  } catch (err) {
    console.error('Error seeding camps:', err);
    throw err;
  }
};

module.exports = seedCamps;