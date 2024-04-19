const amenities = [
    // Basic Amenities
    "Electricity",
    "Water supply",
    "Heating system",
    "Air conditioning",
    "Internet access",
    "Telephone line",

    // Kitchen Amenities
    "Stove/oven",
    "Refrigerator",
    "Microwave",
    "Dishwasher",
    "Kitchen sink",
    "Cabinets and storage space",
    "Kitchen utensils",

    // Bathroom Amenities
    "Toilet",
    "Sink",
    "Shower",
    "Bathtub",
    "Towel racks",
    "Vanity",

    // Bedroom Amenities
    "Bed",
    "Mattress",
    "Wardrobe/closet",
    "Dresser",
    "Nightstands",

    // Living Room Amenities
    "Sofa/couch",
    "Coffee table",
    "Television",
    "Entertainment center",
    "Bookshelves",
    "Chairs",
    "Lamps",

    // Outdoor Amenities
    "Patio/balcony",
    "Garden",
    "Swimming pool",
    "Deck",
    "BBQ area",
    "Outdoor furniture",

    // Building Amenities
    "Elevator",
    "Gym/fitness center",
    "Parking space",
    "Laundry facilities",
    "Security system",
    "Common areas",

    // Community Amenities
    "Park/playground",
    "Tennis/basketball courts",
    "Clubhouse",
    "Walking/biking trails",
    "Picnic area",
    "Dog park",

    // Accessibility Amenities
    "Wheelchair accessibility",
    "Elevator/lift",
    "Ramps",
    "Handrails",
    "Accessible parking",

    // Utilities
    "Central heating",
    "Central air conditioning",
    "Washer and dryer hookups",
    "Garbage disposal",
    "Recycling facilities"
];

const uniqueAmenities = Array.from(new Set(amenities));

export default uniqueAmenities;