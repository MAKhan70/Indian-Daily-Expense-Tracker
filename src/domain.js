export const STORAGE_KEY = "pocket-ledger-v2";
export const LEGACY_STORAGE_KEY = "pocket-ledger-v1";
export const INDIA_TIME_ZONE = "Asia/Kolkata";

export function indiaDateKey(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export const DISPLAY_DATE = indiaDateKey();
export const DISPLAY_MONTH = DISPLAY_DATE.slice(0, 7);

export const APPEARANCE_PALETTES = ["calm-indigo", "heritage", "ocean", "forest", "rose", "saffron", "teal", "cobalt", "amethyst", "terracotta", "monsoon", "lotus", "sandstone", "mint", "slate", "copper", "berry", "lagoon", "marigold", "graphite"];
export const APPEARANCE_DEFAULTS = { mode: "light", palette: "calm-indigo", look: "soft" };
export const DEFAULT_ANALYTICS_MODULES = { pie: true, bar: true, trend: true, pieParameter: "payment", barParameter: "category", trendParameter: "daily" };
export const GROCERY_GROUPS = ["General Grocery", "Grains & Flour", "Rice & Cereals", "Pulses & Lentils", "Spices & Masala", "Cooking Oils & Ghee", "Vegetables", "Fruits", "Dairy & Eggs", "Tea, Coffee & Beverages", "Snacks & Breakfast", "Dry Fruits & Nuts", "Household Cleaning", "Personal Care", "Baby & Pet Care", "Other"];
export const GROCERY_UNITS = ["item", "kg", "g", "litre", "ml", "pack", "piece", "dozen", "bottle", "box", "bag"];

export const QUICK_AMOUNTS = {
  daily: [5, 10, 20, 100],
  weekly: Array.from({ length: 10 }, (_, index) => (index + 1) * 100),
  monthly: Array.from({ length: 10 }, (_, index) => (index + 1) * 1000),
  "one-off": Array.from({ length: 5 }, (_, index) => (index + 1) * 10000),
};

export function indiaGreeting(value = new Date()) {
  const hour = Number(new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(value));
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const FREQUENCIES = [
  { id: "daily", label: "Daily", description: "Everyday essentials and routine purchases" },
  { id: "weekly", label: "Weekly", description: "Planned weekly shops, services and outings" },
  { id: "monthly", label: "Monthly", description: "Bills, EMIs, fees and subscriptions" },
  { id: "one-off", label: "One-off", description: "Occasional, seasonal and exceptional spending" },
];

export const CATEGORY_GROUPS = {
  daily: [
    { name: "Groceries & Fresh Food", subcategories: ["Groceries", "Kirana Store", "Supermarket", "Ration / PDS Shop", "Vegetables & Fruits", "Local Mandi Purchase", "Milk & Dairy", "Bread & Bakery", "Eggs", "Meat & Poultry", "Fish & Seafood", "Cooking Essentials", "Drinking Water Can"] },
    { name: "Meals, Tea & Snacks", subcategories: ["Breakfast", "Lunch", "Dinner", "Tea & Snacks", "Street Food", "Office Canteen", "School Canteen", "Tiffin Service", "Restaurant Meal", "Food Delivery", "Sweets & Mithai", "Juice & Beverages"] },
    { name: "Local Travel & Commute", subcategories: ["Local Transport", "City Bus", "Village / District Bus", "Metro", "Suburban Train", "Auto-rickshaw", "E-rickshaw", "Cycle Rickshaw", "Shared Auto / Tempo", "Taxi / Cab", "Two-wheeler Taxi", "Ferry / Boat", "Daily Train Ticket", "Last-mile Commute"] },
    { name: "Fuel, Parking & Roads", subcategories: ["Fuel", "Petrol", "Diesel", "CNG", "EV Charging", "Parking & Tolls", "FASTag Recharge", "Air Filling / Puncture", "Minor Vehicle Fix"] },
    { name: "Home & Daily Utilities", subcategories: ["Household Supplies", "Cleaning Supplies", "Kitchen Supplies", "Electricity Prepaid Recharge", "Water Purchase", "LPG Top-up", "Kerosene", "Laundry", "Ironing", "Domestic Help", "Waste Collection Fee"] },
    { name: "Health & Medicines", subcategories: ["Medicines", "Pharmacy Purchase", "Doctor Consultation", "Government Clinic", "Private Clinic", "Diagnostic Test", "First Aid", "Ayurveda / Unani / Homeopathy", "Medical Consumables", "Elder Care", "Women’s Health", "Dental Care"] },
    { name: "Personal Care & Clothing", subcategories: ["Personal Care", "Toiletries", "Salon / Barber", "Beauty Care", "Skincare", "Clothing", "Footwear", "Tailoring / Alteration", "Mobile Accessories", "Daily Laundry"] },
    { name: "Children & Education", subcategories: ["School Daily", "School Transport", "Notebook & Stationery", "Photocopy / Printing", "Tuition Daily", "Exam Form", "Pocket Money", "Childcare", "Educational App", "Library / Reading"] },
    { name: "Work & Small Business", subcategories: ["Work Expense", "Office Commute", "Business Supplies", "Shop Supplies", "Raw Material Daily", "Packaging", "Courier / Delivery", "Printing & Xerox", "Tea for Staff", "Daily Wages", "Market Fee"] },
    { name: "Mobile, Digital & Finance", subcategories: ["Mobile Recharge", "Data Pack", "Public Wi-Fi", "UPI / Banking Fee", "ATM Fee", "Wallet Top-up", "Digital Service Fee", "Online Convenience Fee", "Cyber Cafe"] },
    { name: "Family, Community & Faith", subcategories: ["Family Support", "Neighbourhood Help", "Religious Offering", "Temple / Mosque / Church / Gurudwara", "Community Collection", "Charity", "Guest Hospitality", "Local Event", "Funeral Support"] },
    { name: "Farm, Livestock & Rural", subcategories: ["Farm Labour Daily", "Fodder", "Cattle Feed", "Poultry Feed", "Seeds", "Fertiliser Small Purchase", "Pesticide Small Purchase", "Irrigation Charge", "Tractor / Tiller Hire", "Mandi Transport", "Veterinary Medicine", "Farm Tools"] },
    { name: "Pets & Animal Care", subcategories: ["Pet Care", "Pet Food", "Pet Medicine", "Grooming", "Stray Animal Feeding", "Veterinary Visit"] },
    { name: "Other Daily Spending", subcategories: ["News & Newspaper", "Entertainment", "Tobacco / Paan", "Emergency Cash", "Miscellaneous Daily"] },
  ],
  weekly: [
    { name: "Food & Market Shopping", subcategories: ["Weekly Groceries", "Farmers Market", "Weekly Haat / Bazaar", "Wholesale Market", "Vegetable Stock-up", "Fruit Stock-up", "Meat / Fish Purchase", "Dairy Stock-up", "Grains & Pulses", "Spices & Dry Goods", "Snacks Stock-up", "Drinking Water Supply"] },
    { name: "Cooking & Family Meals", subcategories: ["Meal Preparation", "Tiffin Subscription", "Family Dining", "Sunday Meal", "Community Kitchen", "Bakery Order", "Sweets Purchase", "Cooking Gas Reserve"] },
    { name: "Home Cleaning & Upkeep", subcategories: ["Home Cleaning", "Laundry & Dry Cleaning", "Bathroom Supplies", "Kitchen Cleaning", "Pest Control Small Visit", "Gardening", "Minor Plumbing", "Minor Electrical Work", "Waste / Scrap Pickup"] },
    { name: "Travel & Weekly Commute", subcategories: ["Weekly Commute", "Bus Pass Top-up", "Metro Card Top-up", "Train Pass Top-up", "Shared Vehicle Fare", "Intercity Bus", "Fuel Stock-up", "Parking Pass", "Toll / FASTag Top-up"] },
    { name: "Vehicle Care", subcategories: ["Vehicle Upkeep", "Two-wheeler Wash", "Car Wash", "Chain Oil / Lubrication", "Puncture Repair", "Battery Check", "Minor Spare Part", "Local Mechanic"] },
    { name: "Children & Learning", subcategories: ["Kids Allowance", "Tuition Class", "Coaching Class", "Stationery Restock", "School Project", "Sports Coaching", "Music / Dance Class", "Library", "School Activity"] },
    { name: "Health & Care", subcategories: ["Weekly Medicines", "Physiotherapy", "Caregiver", "Elder Support", "Nutrition Supplements", "Fitness Class", "Yoga Class", "Therapy / Counselling", "Health Check"] },
    { name: "Family & Leisure", subcategories: ["Family Outing", "Cinema", "OTT Movie Rental", "Park / Fair", "Sports & Fitness", "Hobbies", "Gaming", "Picnic", "Local Tourism", "Eating Out"] },
    { name: "Work & Business", subcategories: ["Business Inventory", "Raw Materials", "Packaging Supplies", "Courier & Logistics", "Weekly Staff Payment", "Shop Cleaning", "Market Travel", "Printing & Stationery", "Vendor Payment"] },
    { name: "Farm & Livestock", subcategories: ["Weekly Farm Labour", "Animal Feed", "Veterinary Care", "Seedling Purchase", "Fertiliser", "Pesticide", "Irrigation Diesel", "Equipment Hire", "Produce Transport", "Mandi Charges"] },
    { name: "Faith & Community", subcategories: ["Religious & Community", "Weekly Offering", "Community Meal", "Self-help Group Meeting", "Resident Collection", "Local Club", "Volunteer Expense", "Charitable Support"] },
    { name: "Personal & Other", subcategories: ["Salon / Grooming", "Clothing Care", "Tailoring", "Mobile / Device Care", "Household Cash", "Miscellaneous Weekly"] },
  ],
  monthly: [
    { name: "Housing & Property", subcategories: ["Rent", "Home Loan EMI", "Society Maintenance", "Apartment Maintenance", "PG / Hostel Rent", "Shop Rent", "Office Rent", "Warehouse Rent", "Property Caretaker", "Property Management Fee"] },
    { name: "Electricity, Water & Energy", subcategories: ["Electricity", "Prepaid Electricity", "Water", "Municipal Water", "Water Tanker", "Borewell Maintenance", "LPG / Gas", "Piped Gas", "Kerosene", "Solar Maintenance", "Generator Fuel"] },
    { name: "Mobile, Internet & Media", subcategories: ["Mobile Bill", "Postpaid Mobile Bill", "WiFi Bill", "Family Mobile Recharges", "Broadband", "Fiber Internet", "DTH / Streaming", "Cable TV", "Landline", "Newspaper", "Digital News", "Cloud Storage", "Subscriptions"] },
    { name: "Food & Household Budget", subcategories: ["Monthly Groceries", "Ration Purchase", "Wholesale Staples", "Milk Subscription", "Tiffin / Meal Plan", "Household Supplies", "Cleaning Products", "Drinking Water Subscription"] },
    { name: "Education & Coaching", subcategories: ["School Fees", "College Fees", "Tuition", "Coaching Institute", "Competitive Exam Coaching", "School Transport", "Hostel Fees", "Books & Stationery", "Digital Learning", "Daycare / Creche", "Skill Training"] },
    { name: "Domestic & Family Support", subcategories: ["Domestic Help Salary", "Cook Salary", "Driver Salary", "Caregiver Salary", "Security Guard", "Elder Support", "Parents Support", "Child Support", "Family Allowance"] },
    { name: "Family Pocket Money", subcategories: ["Mother", "Father", "Brother", "Sister", "Wife", "Son 1", "Son 2", "Son 3", "Son 4", "Son 5", "Daughter 1", "Daughter 2", "Daughter 3", "Daughter 4", "Daughter 5"] },
    { name: "Medicines", subcategories: ["Father", "Mother", "Brother", "Sister", "Wife", "Son 1", "Son 2", "Son 3", "Son 4", "Son 5", "Daughter 1", "Daughter 2", "Daughter 3", "Daughter 4", "Daughter 5"] },
    { name: "Transport & Vehicle", subcategories: ["Fuel Budget", "Public Transport Pass", "Metro Pass", "Railway Season Ticket", "School Bus Fee", "Vehicle Loan EMI", "Vehicle Service Plan", "Parking Rental", "FASTag Budget", "Driver Expense"] },
    { name: "Loans, Credit & Finance", subcategories: ["Loan EMI", "Personal Loan EMI", "Gold Loan EMI", "Education Loan EMI", "Business Loan EMI", "Microfinance Repayment", "Self-help Group Contribution", "Chit Fund Contribution", "Bank Charges", "Credit Card Bill"] },
    { name: "Insurance & Healthcare", subcategories: ["Insurance", "Health Insurance", "Life Insurance", "Vehicle Insurance", "Crop Insurance", "Medical Care", "Regular Medicines", "Doctor Follow-up", "Diagnostic Plan", "Therapy / Rehabilitation"] },
    { name: "Savings & Investments", subcategories: ["Investments", "Recurring Deposit", "Systematic Investment Plan", "Public Provident Fund", "National Pension System", "Post Office Saving", "Gold Saving Scheme", "Emergency Fund", "Child Education Fund"] },
    { name: "Taxes & Government Charges", subcategories: ["Taxes", "Property Tax", "Professional Tax", "Municipal Charge", "Panchayat Charge", "Trade Licence", "GST Payment", "Income Tax Advance", "Government Service Fee"] },
    { name: "Business & Professional", subcategories: ["Professional Fees", "Accounting Fee", "Legal Retainer", "Shop Staff Salary", "Office Supplies", "Software Subscription", "Business Internet", "Inventory Restock", "Warehouse Charge", "Delivery / Logistics"] },
    { name: "Farm & Rural Operations", subcategories: ["Farm Lease", "Agriculture Loan EMI", "Farm Labour", "Seeds & Saplings", "Fertiliser & Manure", "Pesticides", "Irrigation", "Tractor EMI / Hire", "Dairy Operations", "Poultry Operations", "Cold Storage", "Mandi / APMC Fees"] },
    { name: "Lifestyle, Clubs & Memberships", subcategories: ["Gym Membership", "Sports Club", "Community Club", "Religious Contribution", "OTT Memberships", "Music Subscription", "Gaming Subscription", "Hobby Class", "Pet Care Plan"] },
    { name: "Other Monthly Spending", subcategories: ["Charity", "Pocket Allowance", "Contingency", "Miscellaneous Monthly"] },
  ],
  "one-off": [
    { name: "Home Appliances & Furniture", subcategories: ["Appliances", "Refrigerator", "Washing Machine", "Air Conditioner / Cooler", "Television", "Water Purifier", "Kitchen Appliance", "Furniture", "Mattress & Bedding", "Inverter / Battery", "Solar Equipment", "Large Purchase"] },
    { name: "Home Repair & Construction", subcategories: ["Home Repair", "Home Renovation", "Painting", "Plumbing", "Electrical Rewiring", "Roof Repair", "Carpentry", "Flooring / Tiles", "Bathroom Renovation", "Kitchen Renovation", "Construction Material", "Labour Contractor", "Borewell", "Water Tank"] },
    { name: "Electronics & Digital", subcategories: ["Electronics", "Mobile Phone", "Laptop / Computer", "Tablet", "Camera", "Printer", "Smartwatch", "Home Theatre", "Gaming Console", "CCTV / Security", "Software Purchase"] },
    { name: "Vehicle Purchase & Major Repair", subcategories: ["Vehicle Purchase", "Two-wheeler Purchase", "Car Purchase", "Commercial Vehicle", "E-rickshaw Purchase", "Tractor Purchase", "Vehicle Repair", "Engine Repair", "Tyre Replacement", "Battery Replacement", "Insurance Claim Expense", "Registration / Transfer"] },
    { name: "Medical & Health Events", subcategories: ["Medical Emergency", "Hospital Admission", "Surgery", "Maternity", "Dental Procedure", "Eye Care / Glasses", "Medical Equipment", "Long-term Treatment", "Alternative Treatment", "Ambulance"] },
    { name: "Education & Career", subcategories: ["Education Admission", "College Admission", "School Admission", "Coaching Admission", "Exam Fee", "Study Abroad", "Laptop for Education", "Professional Certification", "Vocational Training", "Education Donation"] },
    { name: "Wedding & Family Ceremonies", subcategories: ["Wedding & Events", "Engagement", "Wedding Venue", "Catering", "Wedding Clothing", "Wedding Jewellery", "Photography", "Naming Ceremony", "Birthday Event", "Anniversary", "Housewarming", "Funeral / Last Rites"] },
    { name: "Festivals & Religious Events", subcategories: ["Festival", "Diwali", "Eid", "Holi", "Christmas", "Pongal / Sankranti", "Onam", "Durga Puja / Navratri", "Ganesh Chaturthi", "Baisakhi", "Chhath Puja", "Religious Ceremony", "Pilgrimage Offering"] },
    { name: "Travel, Holiday & Pilgrimage", subcategories: ["Travel & Holiday", "Flight Tickets", "Rail Tickets", "Bus Tickets", "Hotel / Stay", "Tour Package", "Pilgrimage", "Visa / Passport", "Travel Insurance", "Local Sightseeing", "Relocation"] },
    { name: "Government, Legal & Property", subcategories: ["Legal Fees", "Court Fee", "Stamp Duty", "Property Registration", "Land Survey", "Mutation / Khata", "Government Certificate", "Licence / Permit", "Penalty / Fine", "Consultant / Broker"] },
    { name: "Business & Professional Setup", subcategories: ["Business Setup", "Shop Renovation", "Machinery Purchase", "Commercial Equipment", "Initial Inventory", "Franchise Fee", "Security Deposit", "Website / Branding", "Professional Equipment", "Business Registration"] },
    { name: "Farm & Rural Infrastructure", subcategories: ["Farm Equipment", "Tractor / Tiller", "Irrigation Pump", "Drip Irrigation", "Greenhouse", "Cattle Purchase", "Poultry Setup", "Dairy Equipment", "Farm Shed", "Land Preparation", "Crop Loss Recovery"] },
    { name: "Gifts, Jewellery & Personal", subcategories: ["Gifts", "Jewellery", "Gold Purchase", "Silver Purchase", "Festival Clothing", "Luxury Purchase", "Personal Celebration", "Family Gift", "Corporate Gift"] },
    { name: "Investment & Fund Management Fees", subcategories: ["Quarterly Fund Management Fees", "Half Yearly Fund Management Fees", "Yearly Fund Management Fees"] },
    { name: "Emergency & Community Support", subcategories: ["Emergency Support", "Family Emergency", "Disaster Recovery", "Donation", "Community Project", "Medical Help for Others", "Education Help for Others", "Religious Donation"] },
    { name: "Other One-off Spending", subcategories: ["Refundable Deposit", "Lost / Damaged Item", "Unexpected Charge", "Miscellaneous One-off"] },
  ],
};

export const CATEGORY_LIBRARY = Object.fromEntries(
  Object.entries(CATEGORY_GROUPS).map(([frequency, groups]) => [frequency, [...new Set(groups.flatMap((group) => group.subcategories))]]),
);

const categoryId = (frequency, name) => `built-in-${frequency}-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

export function managedCategoryGroups(categoryConfig, frequency) {
  const safeFrequency = FREQUENCIES.some((item) => item.id === frequency) ? frequency : "daily";
  const builtIn = CATEGORY_GROUPS[safeFrequency].map((group) => ({
    id: categoryId(safeFrequency, group.name),
    name: group.name,
    enabled: true,
    custom: false,
    subcategories: group.subcategories.map((name) => ({ id: categoryId(safeFrequency, `${group.name}-${name}`), name, enabled: true, custom: false })),
  }));
  const configured = Array.isArray(categoryConfig?.[safeFrequency]) ? categoryConfig[safeFrequency] : [];
  if (!configured.length) return builtIn;
  const builtInById = new Map(builtIn.map((group) => [group.id, group]));
  const builtInByName = new Map(builtIn.map((group) => [group.name.toLocaleLowerCase("en-IN"), group]));
  const normalized = configured.filter((group) => group && typeof group.name === "string").map((group) => {
    const fallback = builtInById.get(group.id) || builtInByName.get(group.name.toLocaleLowerCase("en-IN"));
    const subcategories = Array.isArray(group.subcategories) ? group.subcategories.filter((item) => item && typeof item.name === "string").map((item) => ({ id: item.id || crypto.randomUUID(), name: item.name, enabled: item.enabled !== false, custom: Boolean(item.custom) })) : [];
    const knownIds = new Set(subcategories.map((item) => item.id));
    for (const item of fallback?.subcategories || []) if (!knownIds.has(item.id)) subcategories.push(item);
    return { id: group.id || fallback?.id || crypto.randomUUID(), name: group.name, enabled: group.enabled !== false, custom: Boolean(group.custom), subcategories: subcategories.length ? subcategories : (fallback?.subcategories || []) };
  });
  const knownGroupIds = new Set(normalized.map((group) => group.id));
  for (const group of builtIn) if (!knownGroupIds.has(group.id)) normalized.push(group);
  return normalized;
}

export function activeCategoryGroups(categoryConfig, frequency) {
  const active = managedCategoryGroups(categoryConfig, frequency)
    .filter((group) => group.enabled)
    .map((group) => ({ ...group, subcategories: group.subcategories.filter((item) => item.enabled) }))
    .filter((group) => group.subcategories.length);
  return active.length ? active : managedCategoryGroups({}, frequency);
}

export function restoreCategoryOrder(categoryConfig, frequency) {
  const current = managedCategoryGroups(categoryConfig, frequency);
  const defaults = managedCategoryGroups({}, frequency);
  const byId = new Map(current.map((group) => [group.id, group]));
  const defaultIds = new Set(defaults.map((group) => group.id));
  const reordered = defaults.map((defaultGroup) => {
    const saved = byId.get(defaultGroup.id) || defaultGroup;
    const savedSubcategories = new Map(saved.subcategories.map((item) => [item.id, item]));
    const builtInIds = new Set(defaultGroup.subcategories.map((item) => item.id));
    return {
      ...saved,
      subcategories: [
        ...defaultGroup.subcategories.map((item) => savedSubcategories.get(item.id) || item),
        ...saved.subcategories.filter((item) => !builtInIds.has(item.id)),
      ],
    };
  });
  return [...reordered, ...current.filter((group) => !defaultIds.has(group.id))];
}

export function categoryGroupFor(frequency, subcategory) {
  const groups = CATEGORY_GROUPS[frequency] || CATEGORY_GROUPS.daily;
  return groups.find((group) => group.subcategories.includes(subcategory))?.name || groups[0].name;
}

export const PAYMENT_GROUPS = [
  {
    label: "Everyday",
    options: [
      ["cash", "Cash"], ["upi", "UPI"], ["net-banking", "Net Banking"],
      ["debit-card", "Debit Card"], ["credit-card", "Credit Card"], ["mobile-wallet", "Mobile Wallet"],
    ],
  },
  {
    label: "Bank & recurring",
    options: [
      ["bank-transfer", "Bank Transfer"], ["neft", "NEFT"], ["rtgs", "RTGS"], ["imps", "IMPS"],
      ["auto-debit", "Auto-debit / ECS"], ["cheque", "Cheque"], ["demand-draft", "Demand Draft"],
    ],
  },
  {
    label: "Pay later & other",
    options: [
      ["bnpl", "Buy Now, Pay Later"], ["emi", "EMI / Loan"], ["prepaid", "Prepaid Card"],
      ["voucher", "Gift Card / Voucher"], ["reimbursement", "Reimbursement"], ["other", "Other"],
    ],
  },
  {
    label: "Advance payments",
    options: Array.from({ length: 5 }, (_, index) => [`advance-${index + 1}`, `Advance Payment ${index + 1}`]),
  },
  {
    label: "Credit borrow",
    options: Array.from({ length: 5 }, (_, index) => [`credit-${index + 1}`, `Credit Borrow ${index + 1}`]),
  },
];

export const DEFAULT_ALIASES = Object.fromEntries(
  PAYMENT_GROUPS.flatMap((group) => group.options).map(([id, label]) => [id, label]),
);

export const DEFAULT_ADVANCES = Array.from({ length: 5 }, (_, index) => ({
  id: `advance-${index + 1}`,
  label: `Advance Payment ${index + 1}`,
  merchant: index === 0 ? "Fresh Basket Store" : "",
  amountPaid: index === 0 ? 5000 : 0,
}));

export const DEFAULT_CREDITS = Array.from({ length: 5 }, (_, index) => ({
  id: `credit-${index + 1}`,
  label: `Credit Borrow ${index + 1}`,
  merchant: index === 0 ? "Neighbourhood Pharmacy" : "",
  creditLimit: index === 0 ? 10000 : 0,
}));

export const SEED_EXPENSES = [
  { id: "seed-1", name: "Vegetables & fruits", merchant: "D Mart", amount: 620, category: "Vegetables & Fruits", frequency: "daily", payment: "upi", date: "2026-08-31", time: "09:42", color: "sage" },
  { id: "seed-2", name: "Lunch", merchant: "Swiggy", amount: 280, category: "Lunch", frequency: "daily", payment: "upi", date: "2026-08-31", time: "13:15", color: "turmeric" },
  { id: "seed-3", name: "Auto", merchant: "Office commute", amount: 120, category: "Local Transport", frequency: "daily", payment: "cash", date: "2026-08-31", time: "08:55", color: "plum" },
  { id: "seed-4", name: "Electricity bill", merchant: "BESCOM", amount: 1950, category: "Electricity", frequency: "monthly", payment: "net-banking", date: "2026-08-28", time: "19:31", color: "violet" },
  { id: "seed-5", name: "Medicines", merchant: "Neighbourhood Pharmacy", amount: 1199, category: "Medicines", frequency: "daily", payment: "credit-1", date: "2026-08-31", time: "16:20", color: "rose" },
  { id: "seed-6", name: "Festival sweets advance", merchant: "Fresh Basket Store", amount: 1800, category: "Festival", frequency: "one-off", payment: "advance-1", date: "2026-08-30", time: "18:10", color: "blue" },
  { id: "seed-7", name: "Weekly groceries", merchant: "Reliance Fresh", amount: 2450, category: "Weekly Groceries", frequency: "weekly", payment: "debit-card", date: "2026-08-29", time: "11:10", color: "sage" },
  { id: "seed-8", name: "Monthly broadband", merchant: "Airtel Xstream", amount: 999, category: "Broadband", frequency: "monthly", payment: "auto-debit", date: "2026-08-05", time: "07:30", color: "blue" },
  { id: "seed-9", name: "Home repair", merchant: "Ramesh Electricals", amount: 3200, category: "Home Repair", frequency: "one-off", payment: "bank-transfer", date: "2026-08-18", time: "17:00", color: "plum" },
  { id: "seed-plan-1", name: "September school activity", merchant: "Greenwood School", amount: 2400, category: "School Fees", frequency: "monthly", payment: "net-banking", date: "2026-09-07", time: "09:00", color: "turmeric", status: "planned", planNote: "Confirm the final activity fee with the class teacher before paying.", reminder: "both" },
];

export const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const titleCaseDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T12:00:00+05:30`));

export const isAdvancePayment = (payment) => String(payment).startsWith("advance-");
export const isCreditBorrow = (payment) => String(payment).startsWith("credit-");
export const isBudgetExpense = (expense) => !isAdvancePayment(expense.payment) && !isCreditBorrow(expense.payment);
export const isDisplayMonth = (expense) => String(expense.date).startsWith(DISPLAY_MONTH);
export const isPlannedExpense = (expense) => expense.status === "planned";
export const isMonthKey = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(String(value));

export function shiftMonthKey(monthKey, delta) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  const [year, month] = safeMonth.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + Number(delta || 0), 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(monthKey) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${safeMonth}-01T12:00:00Z`));
}

export const expensesForMonth = (expenses, monthKey) =>
  expenses.filter((expense) => String(expense.date).startsWith(isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH));

export function ledgerUsageForMonth(expenses, accounts, monthKey, kind) {
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const amountField = kind === "credit" ? "creditLimit" : "amountPaid";
  const rows = safeAccounts.map((account) => {
    const defined = Math.max(Number(account[amountField]) || 0, 0);
    const used = expensesForMonth(expenses, monthKey)
      .filter((expense) => expense.status !== "planned" && expense.payment === account.id)
      .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    return { id: account.id, label: account.label, merchant: account.merchant, defined, used, available: Math.max(defined - used, 0) };
  });
  return {
    rows,
    defined: rows.reduce((sum, row) => sum + row.defined, 0),
    used: rows.reduce((sum, row) => sum + row.used, 0),
    available: rows.reduce((sum, row) => sum + row.available, 0),
  };
}

export function getBudgetForMonth(state, monthKey) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  const stored = Number(state.monthlyBudgets?.[safeMonth]);
  if (Number.isFinite(stored) && stored >= 0) return stored;
  return Math.max(Number(state.monthlyBudget) || 0, 0);
}

export function withBudgetForMonth(state, monthKey, amount) {
  const safeMonth = isMonthKey(monthKey) ? monthKey : DISPLAY_MONTH;
  const monthlyBudget = Math.max(Number(amount) || 0, 0);
  return {
    ...state,
    monthlyBudget: safeMonth === DISPLAY_MONTH ? monthlyBudget : state.monthlyBudget,
    monthlyBudgets: { ...(state.monthlyBudgets || {}), [safeMonth]: monthlyBudget },
  };
}

export function normalizeExpense(expense, categoryConfig = {}) {
  const frequency = FREQUENCIES.some((item) => item.id === expense.frequency) ? expense.frequency : "daily";
  const configuredGroups = managedCategoryGroups(categoryConfig, frequency);
  const category = String(expense.subcategory || expense.category || configuredGroups[0].subcategories[0].name);
  const categoryGroup = String(expense.categoryGroup || configuredGroups.find((group) => group.subcategories.some((item) => item.name === category))?.name || categoryGroupFor(frequency, category));
  return {
    ...expense,
    frequency,
    category,
    subcategory: category,
    categoryGroup,
    status: expense.status === "planned" ? "planned" : "actual",
    planNote: expense.planNote || "",
    reminder: ["month", "week", "both", "none"].includes(expense.reminder) ? expense.reminder : "both",
  };
}

export function buildAliases(state) {
  return {
    ...DEFAULT_ALIASES,
    ...(state.aliases || {}),
    ...Object.fromEntries((state.advanceAccounts || []).map((account) => [account.id, account.label || DEFAULT_ALIASES[account.id]])),
    ...Object.fromEntries((state.creditAccounts || []).map((account) => [account.id, account.label || DEFAULT_ALIASES[account.id]])),
  };
}

export function createDefaultState() {
  return {
    expenses: SEED_EXPENSES.map(normalizeExpense),
    archivedExpenses: [],
    advanceAccounts: DEFAULT_ADVANCES,
    creditAccounts: DEFAULT_CREDITS,
    monthlyBudget: 50000,
    monthlyBudgets: { [DISPLAY_MONTH]: 50000 },
    aliases: DEFAULT_ALIASES,
    dark: false,
    appearance: { ...APPEARANCE_DEFAULTS },
    categoryConfig: {},
    analyticsModules: { ...DEFAULT_ANALYTICS_MODULES },
    groceryItems: [],
    profilePhoto: "",
  };
}

export function upsertExpenseWithArchive(state, nextExpense, archivedAt = new Date().toISOString(), archiveId = crypto.randomUUID()) {
  const prior = state.expenses.find((item) => item.id === nextExpense.id);
  if (!prior) return { ...state, expenses: [nextExpense, ...state.expenses], archivedExpenses: state.archivedExpenses || [] };
  const archive = { ...prior, archiveId, archivedAt, archiveReason: "Edited" };
  return {
    ...state,
    expenses: state.expenses.map((item) => item.id === nextExpense.id ? nextExpense : item),
    archivedExpenses: [archive, ...(state.archivedExpenses || [])],
  };
}

export function deleteExpenseWithArchive(state, id, archivedAt = new Date().toISOString(), archiveId = crypto.randomUUID()) {
  const prior = state.expenses.find((item) => item.id === id);
  if (!prior) return state;
  const archive = { ...prior, archiveId, archivedAt, archiveReason: "Deleted" };
  return {
    ...state,
    expenses: state.expenses.filter((item) => item.id !== id),
    archivedExpenses: [archive, ...(state.archivedExpenses || [])],
  };
}

export function loadState() {
  const fallback = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.expenses)) return fallback;
    const monthlyBudget = Math.max(Number(parsed.monthlyBudget) || 50000, 0);
    return {
      expenses: parsed.expenses.map((expense) => normalizeExpense(expense, parsed.categoryConfig)),
      archivedExpenses: Array.isArray(parsed.archivedExpenses) ? parsed.archivedExpenses : [],
      advanceAccounts: Array.isArray(parsed.advanceAccounts) ? parsed.advanceAccounts : DEFAULT_ADVANCES,
      creditAccounts: Array.isArray(parsed.creditAccounts) ? parsed.creditAccounts : DEFAULT_CREDITS,
      monthlyBudget,
      monthlyBudgets: {
        ...(parsed.monthlyBudgets && typeof parsed.monthlyBudgets === "object" ? parsed.monthlyBudgets : {}),
        [DISPLAY_MONTH]: parsed.monthlyBudgets?.[DISPLAY_MONTH] ?? monthlyBudget,
      },
      aliases: { ...DEFAULT_ALIASES, ...(parsed.aliases || {}) },
      dark: Boolean(parsed.dark),
      appearance: {
        mode: ["light", "dark", "system"].includes(parsed.appearance?.mode) ? parsed.appearance.mode : (parsed.dark ? "dark" : "light"),
        palette: APPEARANCE_PALETTES.includes(parsed.appearance?.palette) ? parsed.appearance.palette : APPEARANCE_DEFAULTS.palette,
        look: ["soft", "crisp"].includes(parsed.appearance?.look) ? parsed.appearance.look : APPEARANCE_DEFAULTS.look,
      },
      categoryConfig: parsed.categoryConfig && typeof parsed.categoryConfig === "object" ? parsed.categoryConfig : {},
      analyticsModules: {
        pie: parsed.analyticsModules?.pie !== false,
        bar: parsed.analyticsModules?.bar !== false,
        trend: parsed.analyticsModules?.trend !== false,
        pieParameter: ["payment", "category", "frequency", "budget"].includes(parsed.analyticsModules?.pieParameter) ? parsed.analyticsModules.pieParameter : "payment",
        barParameter: ["category", "payment", "frequency", "day"].includes(parsed.analyticsModules?.barParameter) ? parsed.analyticsModules.barParameter : "category",
        trendParameter: ["daily", "cumulative", "budget", "payment"].includes(parsed.analyticsModules?.trendParameter) ? parsed.analyticsModules.trendParameter : "daily",
      },
      groceryItems: Array.isArray(parsed.groceryItems) ? parsed.groceryItems.map((item) => ({
        id: String(item.id || crypto.randomUUID()),
        month: isMonthKey(item.month) ? item.month : DISPLAY_MONTH,
        name: String(item.name || "Grocery item"),
        groupName: String(item.groupName || "General Grocery"),
        quantity: Math.max(Number(item.quantity) || 1, 0.01),
        unit: GROCERY_UNITS.includes(item.unit) ? item.unit : "item",
        unitPrice: item.unitPrice === null || item.unitPrice === "" || !Number.isFinite(Number(item.unitPrice)) ? null : Math.max(Number(item.unitPrice), 0),
        included: item.included !== false,
        purchased: Boolean(item.purchased) && item.included !== false,
        note: String(item.note || ""),
      })) : [],
      profilePhoto: typeof parsed.profilePhoto === "string" && parsed.profilePhoto.startsWith("data:image/") ? parsed.profilePhoto : "",
    };
  } catch {
    return fallback;
  }
}
