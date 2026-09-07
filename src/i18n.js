import { GENERATED_UI_TRANSLATIONS } from "./i18n.generated.js";

const NAV_KEYS = ["dashboard", "transactions", "ledger", "budget", "groceries", "categories", "reports", "settings"];

export const INDIAN_LANGUAGES = [
  ["en", "en-IN", "English", "English", "All India"],
  ["as", "as-IN", "Assamese", "অসমীয়া", "Assam"],
  ["bn", "bn-IN", "Bengali", "বাংলা", "West Bengal, Tripura"],
  ["brx", "brx-IN", "Bodo", "बड़ो", "Assam"],
  ["doi", "doi-IN", "Dogri", "डोगरी", "Jammu & Kashmir"],
  ["gu", "gu-IN", "Gujarati", "ગુજરાતી", "Gujarat, Dadra & Nagar Haveli and Daman & Diu"],
  ["hi", "hi-IN", "Hindi", "हिन्दी", "Hindi-speaking states and union territories"],
  ["kn", "kn-IN", "Kannada", "ಕನ್ನಡ", "Karnataka"],
  ["ks", "ks-IN", "Kashmiri", "کٲشُر", "Jammu & Kashmir"],
  ["kok", "kok-IN", "Konkani", "कोंकणी", "Goa"],
  ["mai", "mai-IN", "Maithili", "मैथिली", "Bihar, Jharkhand"],
  ["ml", "ml-IN", "Malayalam", "മലയാളം", "Kerala, Lakshadweep"],
  ["mni", "mni-IN", "Manipuri", "মৈতৈলোন্", "Manipur"],
  ["mr", "mr-IN", "Marathi", "मराठी", "Maharashtra"],
  ["ne", "ne-IN", "Nepali", "नेपाली", "Sikkim, West Bengal"],
  ["or", "or-IN", "Odia", "ଓଡ଼ିଆ", "Odisha"],
  ["pa", "pa-IN", "Punjabi", "ਪੰਜਾਬੀ", "Punjab, Chandigarh"],
  ["sa", "sa-IN", "Sanskrit", "संस्कृतम्", "Recognised across India"],
  ["sat", "sat-IN", "Santali", "ᱥᱟᱱᱛᱟᱲᱤ", "Jharkhand, Odisha, West Bengal"],
  ["sd", "sd-IN", "Sindhi", "سنڌي", "Sindhi communities across India"],
  ["ta", "ta-IN", "Tamil", "தமிழ்", "Tamil Nadu, Puducherry"],
  ["te", "te-IN", "Telugu", "తెలుగు", "Andhra Pradesh, Telangana"],
  ["ur", "ur-IN", "Urdu", "اردو", "Jammu & Kashmir, Telangana and other states"],
].map(([code, locale, name, nativeName, regions]) => ({ code, locale, name, nativeName, regions }));

const NAV_PACKS = {
  en: ["Dashboard", "Transactions", "Ledger", "Budget & Ledgers", "Monthly Grocery List", "Categories", "Analytics", "Settings"],
  as: ["ডেশ্বব'ৰ্ড", "লেনদেন", "খতিয়ান", "বাজেট আৰু লেজাৰ", "মাহেকীয়া বজাৰ তালিকা", "শ্ৰেণী", "বিশ্লেষণ", "ছেটিংছ"],
  bn: ["ড্যাশবোর্ড", "লেনদেন", "খতিয়ান", "বাজেট ও লেজার", "মাসিক মুদিখানা তালিকা", "বিভাগ", "বিশ্লেষণ", "সেটিংস"],
  brx: ["डेशबोर्ड", "लेनदेन", "हिसाब खाथा", "बाजेट आरो लेजार", "दानायारि बाजार फारिलाइ", "थाखो", "बिजिरनाय", "सेटिं"],
  doi: ["डैशबोर्ड", "लेन-देन", "खाता", "बजट ते खाते", "महीने दी राशन सूची", "श्रेणियां", "विश्लेषण", "सेटिंगां"],
  gu: ["ડેશબોર્ડ", "વ્યવહારો", "ખાતાવહી", "બજેટ અને ખાતાવહી", "માસિક કરિયાણાની યાદી", "શ્રેણીઓ", "વિશ્લેષણ", "સેટિંગ્સ"],
  hi: ["डैशबोर्ड", "लेन-देन", "बहीखाता", "बजट और खाते", "मासिक किराना सूची", "श्रेणियाँ", "विश्लेषण", "सेटिंग्स"],
  kn: ["ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "ವಹಿವಾಟುಗಳು", "ಲೆಡ್ಜರ್", "ಬಜೆಟ್ ಮತ್ತು ಲೆಡ್ಜರ್", "ಮಾಸಿಕ ದಿನಸಿ ಪಟ್ಟಿ", "ವರ್ಗಗಳು", "ವಿಶ್ಲೇಷಣೆ", "ಸೆಟ್ಟಿಂಗ್‌ಗಳು"],
  ks: ["ڈیش بورڈ", "لین دین", "کھاتہ", "بجٹ تہٕ کھاتہ", "ماہانہ راشن فہرست", "زمرٕ", "تجزیہ", "ترتیبات"],
  kok: ["डॅशबोर्ड", "वेव्हार", "खातें", "अंदाजपत्रक आनी खातीं", "म्हयन्याची किराणा वळेरी", "वर्ग", "विश्लेषण", "सेटिंग्स"],
  mai: ["डैशबोर्ड", "लेन-देन", "बहीखाता", "बजट आ खाता", "मासिक किराना सूची", "श्रेणी", "विश्लेषण", "सेटिंग्स"],
  ml: ["ഡാഷ്ബോർഡ്", "ഇടപാടുകൾ", "കണക്കുപുസ്തകം", "ബജറ്റും കണക്കുകളും", "പ്രതിമാസ പലചരക്ക് പട്ടിക", "വിഭാഗങ്ങൾ", "വിശകലനം", "ക്രമീകരണങ്ങൾ"],
  mni: ["ডেশবোর্ড", "লেনদেন", "খাতা", "বজেট অমসুং খাতা", "থা খুদিংগী পোৎলৈ লিস্ট", "কাংলুপ", "বিশ্লেষণ", "সেটিংস"],
  mr: ["डॅशबोर्ड", "व्यवहार", "खातेवही", "बजेट आणि खाती", "मासिक किराणा यादी", "श्रेणी", "विश्लेषण", "सेटिंग्ज"],
  ne: ["ड्यासबोर्ड", "कारोबार", "खाता", "बजेट र खाताहरू", "मासिक किराना सूची", "श्रेणीहरू", "विश्लेषण", "सेटिङहरू"],
  or: ["ଡ୍ୟାସବୋର୍ଡ", "କାରବାର", "ଖାତା", "ବଜେଟ୍ ଓ ଖାତା", "ମାସିକ ତେଜରାତି ତାଲିକା", "ବର୍ଗ", "ବିଶ୍ଳେଷଣ", "ସେଟିଂସ୍"],
  pa: ["ਡੈਸ਼ਬੋਰਡ", "ਲੈਣ-ਦੇਣ", "ਖਾਤਾ", "ਬਜਟ ਅਤੇ ਖਾਤੇ", "ਮਹੀਨਾਵਾਰ ਕਰਿਆਨੇ ਦੀ ਸੂਚੀ", "ਸ਼੍ਰੇਣੀਆਂ", "ਵਿਸ਼ਲੇਸ਼ਣ", "ਸੈਟਿੰਗਾਂ"],
  sa: ["मुखपटलम्", "व्यवहाराः", "लेखापुस्तकम्", "आयव्ययः लेखाश्च", "मासिक-सामग्री-सूची", "वर्गाः", "विश्लेषणम्", "विन्यासाः"],
  sat: ["ᱰᱮᱥᱵᱳᱨᱰ", "ᱞᱮᱱᱫᱮᱱ", "ᱦᱤᱥᱟᱹᱵ", "ᱵᱟᱡᱮᱴ ᱟᱨ ᱦᱤᱥᱟᱹᱵ", "ᱪᱟᱸᱫᱚ ᱵᱟᱡᱟᱨ ᱞᱤᱥᱴ", "ᱦᱟᱹᱴᱤᱧ", "ᱵᱤᱥᱞᱮᱥᱚᱱ", "ᱥᱮᱴᱤᱝ"],
  sd: ["ڊيش بورڊ", "ڏيتي ليتي", "کاتو", "بجيٽ ۽ کاتا", "ماهوار راشن فهرست", "زمرا", "تجزيو", "سيٽنگون"],
  ta: ["முகப்புப் பலகை", "பரிவர்த்தனைகள்", "பேரேடு", "பட்ஜெட் மற்றும் பேரேடுகள்", "மாதாந்திர மளிகைப் பட்டியல்", "வகைகள்", "பகுப்பாய்வு", "அமைப்புகள்"],
  te: ["డ్యాష్‌బోర్డ్", "లావాదేవీలు", "లెడ్జర్", "బడ్జెట్ మరియు లెడ్జర్లు", "నెలవారీ కిరాణా జాబితా", "వర్గాలు", "విశ్లేషణ", "సెట్టింగ్‌లు"],
  ur: ["ڈیش بورڈ", "لین دین", "کھاتہ", "بجٹ اور کھاتے", "ماہانہ راشن فہرست", "زمرے", "تجزیہ", "ترتیبات"],
};

const SUMMARY_PACKS = {
  en: ["Included", "Purchased", "Skipped", "Estimated list"], hi: ["शामिल", "खरीदा", "छोड़ा", "अनुमानित सूची"],
  bn: ["অন্তর্ভুক্ত", "কেনা হয়েছে", "বাদ দেওয়া", "আনুমানিক তালিকা"], gu: ["સમાવેલ", "ખરીદેલું", "છોડેલું", "અંદાજિત યાદી"],
  kn: ["ಸೇರಿಸಲಾಗಿದೆ", "ಖರೀದಿಸಲಾಗಿದೆ", "ಬಿಡಲಾಗಿದೆ", "ಅಂದಾಜು ಪಟ್ಟಿ"], ml: ["ഉൾപ്പെടുത്തി", "വാങ്ങിയത്", "ഒഴിവാക്കി", "കണക്കാക്കിയ പട്ടിക"],
  mr: ["समाविष्ट", "खरेदी केले", "वगळले", "अंदाजित यादी"], or: ["ସାମିଲ", "କିଣାଯାଇଛି", "ଛାଡ଼ାଯାଇଛି", "ଆନୁମାନିକ ତାଲିକା"],
  pa: ["ਸ਼ਾਮਲ", "ਖਰੀਦਿਆ", "ਛੱਡਿਆ", "ਅੰਦਾਜ਼ਨ ਸੂਚੀ"], ta: ["சேர்க்கப்பட்டது", "வாங்கப்பட்டது", "தவிர்க்கப்பட்டது", "மதிப்பிடப்பட்ட பட்டியல்"],
  te: ["చేర్చినవి", "కొన్నవి", "దాటవేసినవి", "అంచనా జాబితా"], ur: ["شامل", "خریدا گیا", "چھوڑا گیا", "تخمینی فہرست"],
};

export const SUPPORTED_LANGUAGE_CODES = INDIAN_LANGUAGES.map((language) => language.code);

export const LANGUAGE_STORAGE_KEY = "pocket-ledger-language";
export const RTL_LANGUAGE_CODES = new Set(["ks", "sd", "ur"]);

const CORE_KEYS = [
  "Daily Expense Tracker", "Add expense", "Log expense", "Save expense", "Cancel", "Delete", "Edit", "Close",
  "Today", "Yesterday", "Previous month", "Next month", "Choose month", "Search", "Amount", "Date", "Category",
  "Sub-category", "Payment method", "Payment method / mode", "Optional", "Monthly budget", "Spent", "Remaining", "used",
  "Profile", "Your profile", "Add profile picture", "Change profile picture", "Dark mode", "Light theme", "Dark theme",
  "All", "Daily", "Weekly", "Monthly", "One-off", "Transactions", "Settings", "Analytics", "Ledger", "Categories",
  "Cash", "Net Banking", "Debit Card", "Credit Card", "Mobile Wallet", "Other", "Merchant / shop", "Expense name",
  "Planned", "Recorded", "Archived", "Custom", "Enabled", "On", "Off", "Sign in", "Sign out", "Password",
  "Email address", "Your name", "Create account", "Please wait…", "Previous", "Next", "Save", "Update item",
];

const CORE_PACKS = {
  en: CORE_KEYS,
  as: ["দৈনিক খৰচ ট্ৰেকাৰ","খৰচ যোগ কৰক","খৰচ লিখক","খৰচ সংৰক্ষণ কৰক","বাতিল","মচক","সম্পাদনা","বন্ধ","আজি","কালি","আগৰ মাহ","পৰৱৰ্তী মাহ","মাহ বাছক","সন্ধান","পৰিমাণ","তাৰিখ","শ্ৰেণী","উপ-শ্ৰেণী","পেমেণ্ট পদ্ধতি","পেমেণ্ট পদ্ধতি / মাধ্যম","ঐচ্ছিক","মাহেকীয়া বাজেট","খৰচ","অৱশিষ্ট","ব্যৱহৃত","প্ৰফাইল","আপোনাৰ প্ৰফাইল","প্ৰফাইল ছবি যোগ কৰক","প্ৰফাইল ছবি সলনি কৰক","ডাৰ্ক মোড","লাইট থীম","ডাৰ্ক থীম","সকলো","দৈনিক","সাপ্তাহিক","মাহেকীয়া","এককালীন","লেনদেন","ছেটিংছ","বিশ্লেষণ","খতিয়ান","শ্ৰেণী","নগদ","নেট বেংকিং","ডেবিট কাৰ্ড","ক্ৰেডিট কাৰ্ড","মোবাইল ৱালেট","অন্যান্য","ব্যৱসায়ী / দোকান","খৰচৰ নাম","পৰিকল্পিত","লিপিবদ্ধ","সংৰক্ষিত","কাষ্টম","সক্ৰিয়","অন","অফ","ছাইন ইন","ছাইন আউট","পাছৱৰ্ড","ইমেইল ঠিকনা","আপোনাৰ নাম","একাউণ্ট সৃষ্টি","অনুগ্ৰহ কৰি অপেক্ষা কৰক…","আগৰ","পিছৰ","সংৰক্ষণ","আইটেম আপডেট"],
  bn: ["দৈনিক খরচ ট্র্যাকার","খরচ যোগ করুন","খরচ লিখুন","খরচ সংরক্ষণ করুন","বাতিল","মুছুন","সম্পাদনা","বন্ধ","আজ","গতকাল","আগের মাস","পরের মাস","মাস বাছুন","খুঁজুন","পরিমাণ","তারিখ","বিভাগ","উপ-বিভাগ","পেমেন্ট পদ্ধতি","পেমেন্ট পদ্ধতি / মাধ্যম","ঐচ্ছিক","মাসিক বাজেট","খরচ হয়েছে","অবশিষ্ট","ব্যবহৃত","প্রোফাইল","আপনার প্রোফাইল","প্রোফাইল ছবি যোগ করুন","প্রোফাইল ছবি বদলান","ডার্ক মোড","লাইট থিম","ডার্ক থিম","সব","দৈনিক","সাপ্তাহিক","মাসিক","এককালীন","লেনদেন","সেটিংস","বিশ্লেষণ","খতিয়ান","বিভাগ","নগদ","নেট ব্যাংকিং","ডেবিট কার্ড","ক্রেডিট কার্ড","মোবাইল ওয়ালেট","অন্যান্য","ব্যবসায়ী / দোকান","খরচের নাম","পরিকল্পিত","রেকর্ড করা","আর্কাইভ","কাস্টম","সক্রিয়","চালু","বন্ধ","সাইন ইন","সাইন আউট","পাসওয়ার্ড","ইমেল ঠিকানা","আপনার নাম","অ্যাকাউন্ট তৈরি","অনুগ্রহ করে অপেক্ষা করুন…","আগের","পরের","সংরক্ষণ","আইটেম আপডেট"],
  gu: ["દૈનિક ખર્ચ ટ્રેકર","ખર્ચ ઉમેરો","ખર્ચ નોંધો","ખર્ચ સાચવો","રદ કરો","કાઢી નાખો","ફેરફાર કરો","બંધ કરો","આજે","ગઈકાલે","પાછલો મહિનો","આગલો મહિનો","મહિનો પસંદ કરો","શોધો","રકમ","તારીખ","શ્રેણી","ઉપ-શ્રેણી","ચુકવણી પદ્ધતિ","ચુકવણી પદ્ધતિ / માધ્યમ","વૈકલ્પિક","માસિક બજેટ","ખર્ચ્યું","બાકી","વપરાયેલ","પ્રોફાઇલ","તમારી પ્રોફાઇલ","પ્રોફાઇલ ફોટો ઉમેરો","પ્રોફાઇલ ફોટો બદલો","ડાર્ક મોડ","લાઇટ થીમ","ડાર્ક થીમ","બધા","દૈનિક","સાપ્તાહિક","માસિક","એક વખત","વ્યવહારો","સેટિંગ્સ","વિશ્લેષણ","ખાતાવહી","શ્રેણીઓ","રોકડ","નેટ બેન્કિંગ","ડેબિટ કાર્ડ","ક્રેડિટ કાર્ડ","મોબાઇલ વૉલેટ","અન્ય","વેપારી / દુકાન","ખર્ચનું નામ","આયોજિત","નોંધાયેલ","આર્કાઇવ","કસ્ટમ","સક્રિય","ચાલુ","બંધ","સાઇન ઇન","સાઇન આઉટ","પાસવર્ડ","ઇમેલ સરનામું","તમારું નામ","એકાઉન્ટ બનાવો","કૃપા કરીને રાહ જુઓ…","પાછળ","આગળ","સાચવો","વસ્તુ અપડેટ કરો"],
  hi: ["दैनिक खर्च ट्रैकर","खर्च जोड़ें","खर्च दर्ज करें","खर्च सहेजें","रद्द करें","हटाएँ","संपादित करें","बंद करें","आज","कल","पिछला महीना","अगला महीना","महीना चुनें","खोजें","राशि","तारीख","श्रेणी","उप-श्रेणी","भुगतान का तरीका","भुगतान का तरीका / माध्यम","वैकल्पिक","मासिक बजट","खर्च","शेष","उपयोग हुआ","प्रोफ़ाइल","आपकी प्रोफ़ाइल","प्रोफ़ाइल चित्र जोड़ें","प्रोफ़ाइल चित्र बदलें","डार्क मोड","लाइट थीम","डार्क थीम","सभी","दैनिक","साप्ताहिक","मासिक","एकमुश्त","लेन-देन","सेटिंग्स","विश्लेषण","बहीखाता","श्रेणियाँ","नकद","नेट बैंकिंग","डेबिट कार्ड","क्रेडिट कार्ड","मोबाइल वॉलेट","अन्य","व्यापारी / दुकान","खर्च का नाम","नियोजित","दर्ज","संग्रहित","कस्टम","सक्रिय","चालू","बंद","साइन इन","साइन आउट","पासवर्ड","ईमेल पता","आपका नाम","खाता बनाएँ","कृपया प्रतीक्षा करें…","पिछला","अगला","सहेजें","वस्तु अपडेट करें"],
  kn: ["ದೈನಂದಿನ ಖರ್ಚು ಟ್ರ್ಯಾಕರ್","ಖರ್ಚು ಸೇರಿಸಿ","ಖರ್ಚು ದಾಖಲಿಸಿ","ಖರ್ಚು ಉಳಿಸಿ","ರದ್ದು","ಅಳಿಸಿ","ತಿದ್ದು","ಮುಚ್ಚಿ","ಇಂದು","ನಿನ್ನೆ","ಹಿಂದಿನ ತಿಂಗಳು","ಮುಂದಿನ ತಿಂಗಳು","ತಿಂಗಳು ಆಯ್ಕೆಮಾಡಿ","ಹುಡುಕಿ","ಮೊತ್ತ","ದಿನಾಂಕ","ವರ್ಗ","ಉಪವರ್ಗ","ಪಾವತಿ ವಿಧಾನ","ಪಾವತಿ ವಿಧಾನ / ಮಾಧ್ಯಮ","ಐಚ್ಛಿಕ","ಮಾಸಿಕ ಬಜೆಟ್","ಖರ್ಚು","ಉಳಿದಿದೆ","ಬಳಸಿದೆ","ಪ್ರೊಫೈಲ್","ನಿಮ್ಮ ಪ್ರೊಫೈಲ್","ಪ್ರೊಫೈಲ್ ಚಿತ್ರ ಸೇರಿಸಿ","ಪ್ರೊಫೈಲ್ ಚಿತ್ರ ಬದಲಿಸಿ","ಡಾರ್ಕ್ ಮೋಡ್","ಲೈಟ್ ಥೀಮ್","ಡಾರ್ಕ್ ಥೀಮ್","ಎಲ್ಲಾ","ದೈನಂದಿನ","ಸಾಪ್ತಾಹಿಕ","ಮಾಸಿಕ","ಒಂದು ಬಾರಿ","ವಹಿವಾಟುಗಳು","ಸೆಟ್ಟಿಂಗ್‌ಗಳು","ವಿಶ್ಲೇಷಣೆ","ಲೆಡ್ಜರ್","ವರ್ಗಗಳು","ನಗದು","ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್","ಡೆಬಿಟ್ ಕಾರ್ಡ್","ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್","ಮೊಬೈಲ್ ವಾಲೆಟ್","ಇತರೆ","ವ್ಯಾಪಾರಿ / ಅಂಗಡಿ","ಖರ್ಚಿನ ಹೆಸರು","ಯೋಜಿತ","ದಾಖಲಿಸಲಾಗಿದೆ","ಆರ್ಕೈವ್","ಕಸ್ಟಮ್","ಸಕ್ರಿಯ","ಆನ್","ಆಫ್","ಸೈನ್ ಇನ್","ಸೈನ್ ಔಟ್","ಪಾಸ್‌ವರ್ಡ್","ಇಮೇಲ್ ವಿಳಾಸ","ನಿಮ್ಮ ಹೆಸರು","ಖಾತೆ ರಚಿಸಿ","ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ…","ಹಿಂದೆ","ಮುಂದೆ","ಉಳಿಸಿ","ವಸ್ತು ನವೀಕರಿಸಿ"],
  ml: ["ദൈനംദിന ചെലവ് ട്രാക്കർ","ചെലവ് ചേർക്കുക","ചെലവ് രേഖപ്പെടുത്തുക","ചെലവ് സംരക്ഷിക്കുക","റദ്ദാക്കുക","ഇല്ലാതാക്കുക","തിരുത്തുക","അടയ്ക്കുക","ഇന്ന്","ഇന്നലെ","മുൻ മാസം","അടുത്ത മാസം","മാസം തിരഞ്ഞെടുക്കുക","തിരയുക","തുക","തീയതി","വിഭാഗം","ഉപവിഭാഗം","പണമടയ്ക്കൽ രീതി","പണമടയ്ക്കൽ രീതി / മാർഗം","ഐച്ഛികം","പ്രതിമാസ ബജറ്റ്","ചെലവഴിച്ചു","ബാക്കി","ഉപയോഗിച്ചു","പ്രൊഫൈൽ","നിങ്ങളുടെ പ്രൊഫൈൽ","പ്രൊഫൈൽ ചിത്രം ചേർക്കുക","പ്രൊഫൈൽ ചിത്രം മാറ്റുക","ഡാർക്ക് മോഡ്","ലൈറ്റ് തീം","ഡാർക്ക് തീം","എല്ലാം","ദൈനംദിന","പ്രതിവാര","പ്രതിമാസ","ഒറ്റത്തവണ","ഇടപാടുകൾ","ക്രമീകരണങ്ങൾ","വിശകലനം","കണക്കുപുസ്തകം","വിഭാഗങ്ങൾ","പണം","നെറ്റ് ബാങ്കിംഗ്","ഡെബിറ്റ് കാർഡ്","ക്രെഡിറ്റ് കാർഡ്","മൊബൈൽ വാലറ്റ്","മറ്റുള്ളവ","വ്യാപാരി / കട","ചെലവിന്റെ പേര്","ആസൂത്രണം ചെയ്തത്","രേഖപ്പെടുത്തി","ആർക്കൈവ്","കസ്റ്റം","പ്രവർത്തനക്ഷമം","ഓൺ","ഓഫ്","സൈൻ ഇൻ","സൈൻ ഔട്ട്","പാസ്‌വേഡ്","ഇമെയിൽ വിലാസം","നിങ്ങളുടെ പേര്","അക്കൗണ്ട് സൃഷ്ടിക്കുക","ദയവായി കാത്തിരിക്കുക…","മുൻപ്","അടുത്തത്","സംരക്ഷിക്കുക","ഇനം പുതുക്കുക"],
  mr: ["दैनंदिन खर्च ट्रॅकर","खर्च जोडा","खर्च नोंदवा","खर्च जतन करा","रद्द करा","हटवा","संपादित करा","बंद करा","आज","काल","मागील महिना","पुढील महिना","महिना निवडा","शोधा","रक्कम","तारीख","श्रेणी","उप-श्रेणी","पेमेंट पद्धत","पेमेंट पद्धत / माध्यम","ऐच्छिक","मासिक बजेट","खर्च","शिल्लक","वापरले","प्रोफाइल","तुमचे प्रोफाइल","प्रोफाइल चित्र जोडा","प्रोफाइल चित्र बदला","डार्क मोड","लाइट थीम","डार्क थीम","सर्व","दैनंदिन","साप्ताहिक","मासिक","एकदाच","व्यवहार","सेटिंग्ज","विश्लेषण","खातेवही","श्रेणी","रोख","नेट बँकिंग","डेबिट कार्ड","क्रेडिट कार्ड","मोबाइल वॉलेट","इतर","व्यापारी / दुकान","खर्चाचे नाव","नियोजित","नोंदवले","संग्रहित","सानुकूल","सक्रिय","चालू","बंद","साइन इन","साइन आउट","पासवर्ड","ईमेल पत्ता","तुमचे नाव","खाते तयार करा","कृपया प्रतीक्षा करा…","मागील","पुढील","जतन करा","वस्तू अपडेट करा"],
  or: ["ଦୈନିକ ଖର୍ଚ୍ଚ ଟ୍ରାକର","ଖର୍ଚ୍ଚ ଯୋଡ଼ନ୍ତୁ","ଖର୍ଚ୍ଚ ଲେଖନ୍ତୁ","ଖର୍ଚ୍ଚ ସଞ୍ଚୟ କରନ୍ତୁ","ବାତିଲ","ବିଲୋପ","ସମ୍ପାଦନା","ବନ୍ଦ","ଆଜି","ଗତକାଲି","ପୂର୍ବ ମାସ","ପର ମାସ","ମାସ ବାଛନ୍ତୁ","ଖୋଜନ୍ତୁ","ପରିମାଣ","ତାରିଖ","ବର୍ଗ","ଉପ-ବର୍ଗ","ଦେୟ ପଦ୍ଧତି","ଦେୟ ପଦ୍ଧତି / ମାଧ୍ୟମ","ଇଚ୍ଛାଧୀନ","ମାସିକ ବଜେଟ୍","ଖର୍ଚ୍ଚ","ବାକି","ବ୍ୟବହୃତ","ପ୍ରୋଫାଇଲ୍","ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍","ପ୍ରୋଫାଇଲ୍ ଛବି ଯୋଡ଼ନ୍ତୁ","ପ୍ରୋଫାଇଲ୍ ଛବି ବଦଳାନ୍ତୁ","ଡାର୍କ ମୋଡ୍","ଲାଇଟ୍ ଥିମ୍","ଡାର୍କ ଥିମ୍","ସବୁ","ଦୈନିକ","ସାପ୍ତାହିକ","ମାସିକ","ଏକକାଳୀନ","କାରବାର","ସେଟିଂସ୍","ବିଶ୍ଳେଷଣ","ଖାତା","ବର୍ଗ","ନଗଦ","ନେଟ୍ ବ୍ୟାଙ୍କିଙ୍ଗ୍","ଡେବିଟ୍ କାର୍ଡ","କ୍ରେଡିଟ୍ କାର୍ଡ","ମୋବାଇଲ୍ ୱାଲେଟ୍","ଅନ୍ୟ","ବ୍ୟବସାୟୀ / ଦୋକାନ","ଖର୍ଚ୍ଚର ନାମ","ଯୋଜିତ","ଲିପିବଦ୍ଧ","ଆର୍କାଇଭ୍","କଷ୍ଟମ୍","ସକ୍ରିୟ","ଅନ୍","ଅଫ୍","ସାଇନ୍ ଇନ୍","ସାଇନ୍ ଆଉଟ୍","ପାସୱାର୍ଡ","ଇମେଲ୍ ଠିକଣା","ଆପଣଙ୍କ ନାମ","ଖାତା ସୃଷ୍ଟି","ଦୟାକରି ଅପେକ୍ଷା କରନ୍ତୁ…","ପୂର୍ବ","ପର","ସଞ୍ଚୟ","ଆଇଟମ୍ ଅପଡେଟ୍"],
  pa: ["ਰੋਜ਼ਾਨਾ ਖਰਚਾ ਟਰੈਕਰ","ਖਰਚਾ ਜੋੜੋ","ਖਰਚਾ ਦਰਜ ਕਰੋ","ਖਰਚਾ ਸੰਭਾਲੋ","ਰੱਦ ਕਰੋ","ਮਿਟਾਓ","ਸੋਧੋ","ਬੰਦ ਕਰੋ","ਅੱਜ","ਕੱਲ੍ਹ","ਪਿਛਲਾ ਮਹੀਨਾ","ਅਗਲਾ ਮਹੀਨਾ","ਮਹੀਨਾ ਚੁਣੋ","ਖੋਜੋ","ਰਕਮ","ਤਾਰੀਖ","ਸ਼੍ਰੇਣੀ","ਉਪ-ਸ਼੍ਰੇਣੀ","ਭੁਗਤਾਨ ਵਿਧੀ","ਭੁਗਤਾਨ ਵਿਧੀ / ਮਾਧਿਅਮ","ਵਿਕਲਪਿਕ","ਮਹੀਨਾਵਾਰ ਬਜਟ","ਖਰਚਿਆ","ਬਾਕੀ","ਵਰਤਿਆ","ਪ੍ਰੋਫਾਈਲ","ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ","ਪ੍ਰੋਫਾਈਲ ਤਸਵੀਰ ਜੋੜੋ","ਪ੍ਰੋਫਾਈਲ ਤਸਵੀਰ ਬਦਲੋ","ਡਾਰਕ ਮੋਡ","ਲਾਈਟ ਥੀਮ","ਡਾਰਕ ਥੀਮ","ਸਾਰੇ","ਰੋਜ਼ਾਨਾ","ਹਫ਼ਤਾਵਾਰੀ","ਮਹੀਨਾਵਾਰ","ਇੱਕ ਵਾਰ","ਲੈਣ-ਦੇਣ","ਸੈਟਿੰਗਾਂ","ਵਿਸ਼ਲੇਸ਼ਣ","ਖਾਤਾ","ਸ਼੍ਰੇਣੀਆਂ","ਨਕਦ","ਨੈੱਟ ਬੈਂਕਿੰਗ","ਡੈਬਿਟ ਕਾਰਡ","ਕ੍ਰੈਡਿਟ ਕਾਰਡ","ਮੋਬਾਈਲ ਵਾਲਿਟ","ਹੋਰ","ਵਪਾਰੀ / ਦੁਕਾਨ","ਖਰਚੇ ਦਾ ਨਾਮ","ਯੋਜਿਤ","ਦਰਜ","ਆਰਕਾਈਵ","ਕਸਟਮ","ਸਮਰੱਥ","ਚਾਲੂ","ਬੰਦ","ਸਾਈਨ ਇਨ","ਸਾਈਨ ਆਉਟ","ਪਾਸਵਰਡ","ਈਮੇਲ ਪਤਾ","ਤੁਹਾਡਾ ਨਾਮ","ਖਾਤਾ ਬਣਾਓ","ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕੋ…","ਪਿਛਲਾ","ਅਗਲਾ","ਸੰਭਾਲੋ","ਆਈਟਮ ਅੱਪਡੇਟ ਕਰੋ"],
  ta: ["தினசரி செலவு கண்காணிப்பான்","செலவைச் சேர்க்கவும்","செலவைப் பதிவு செய்க","செலவைச் சேமிக்கவும்","ரத்துசெய்","நீக்கு","திருத்து","மூடு","இன்று","நேற்று","முந்தைய மாதம்","அடுத்த மாதம்","மாதத்தைத் தேர்ந்தெடுக்கவும்","தேடு","தொகை","தேதி","வகை","துணை வகை","கட்டண முறை","கட்டண முறை / வழி","விருப்பத்தேர்வு","மாதாந்திர பட்ஜெட்","செலவிட்டது","மீதம்","பயன்படுத்தியது","சுயவிவரம்","உங்கள் சுயவிவரம்","சுயவிவரப் படம் சேர்க்கவும்","சுயவிவரப் படம் மாற்றவும்","இருண்ட பயன்முறை","வெளிர் தீம்","இருண்ட தீம்","அனைத்தும்","தினசரி","வாராந்திர","மாதாந்திர","ஒருமுறை","பரிவர்த்தனைகள்","அமைப்புகள்","பகுப்பாய்வு","பேரேடு","வகைகள்","ரொக்கம்","நெட் பேங்கிங்","டெபிட் கார்டு","கிரெடிட் கார்டு","மொபைல் வாலெட்","மற்றவை","வணிகர் / கடை","செலவுப் பெயர்","திட்டமிட்டது","பதிவுசெய்தது","காப்பகம்","தனிப்பயன்","இயக்கப்பட்டது","ஆன்","ஆஃப்","உள்நுழைக","வெளியேறு","கடவுச்சொல்","மின்னஞ்சல் முகவரி","உங்கள் பெயர்","கணக்கை உருவாக்கு","தயவுசெய்து காத்திருக்கவும்…","முந்தைய","அடுத்தது","சேமி","பொருளைப் புதுப்பி"],
  te: ["రోజువారీ ఖర్చు ట్రాకర్","ఖర్చు జోడించండి","ఖర్చు నమోదు చేయండి","ఖర్చు సేవ్ చేయండి","రద్దు","తొలగించు","సవరించు","మూసివేయి","ఈరోజు","నిన్న","మునుపటి నెల","తదుపరి నెల","నెలను ఎంచుకోండి","శోధించు","మొత్తం","తేదీ","వర్గం","ఉపవర్గం","చెల్లింపు పద్ధతి","చెల్లింపు పద్ధతి / మోడ్","ఐచ్ఛికం","నెలవారీ బడ్జెట్","ఖర్చు","మిగిలినది","ఉపయోగించినది","ప్రొఫైల్","మీ ప్రొఫైల్","ప్రొఫైల్ చిత్రం జోడించండి","ప్రొఫైల్ చిత్రం మార్చండి","డార్క్ మోడ్","లైట్ థీమ్","డార్క్ థీమ్","అన్నీ","రోజువారీ","వారంవారీ","నెలవారీ","ఒకసారి","లావాదేవీలు","సెట్టింగ్‌లు","విశ్లేషణ","లెడ్జర్","వర్గాలు","నగదు","నెట్ బ్యాంకింగ్","డెబిట్ కార్డ్","క్రెడిట్ కార్డ్","మొబైల్ వాలెట్","ఇతర","వ్యాపారి / దుకాణం","ఖర్చు పేరు","ప్రణాళిక చేసినది","నమోదైంది","ఆర్కైవ్","కస్టమ్","ప్రారంభించబడింది","ఆన్","ఆఫ్","సైన్ ఇన్","సైన్ అవుట్","పాస్‌వర్డ్","ఇమెయిల్ చిరునామా","మీ పేరు","ఖాతా సృష్టించండి","దయచేసి వేచి ఉండండి…","మునుపటి","తదుపరి","సేవ్","వస్తువు నవీకరించండి"],
  ur: ["روزانہ اخراجات کا ریکارڈ","خرچ شامل کریں","خرچ درج کریں","خرچ محفوظ کریں","منسوخ","حذف کریں","ترمیم","بند کریں","آج","گزشتہ کل","پچھلا مہینہ","اگلا مہینہ","مہینہ منتخب کریں","تلاش","رقم","تاریخ","زمرہ","ذیلی زمرہ","ادائیگی کا طریقہ","ادائیگی کا طریقہ / ذریعہ","اختیاری","ماہانہ بجٹ","خرچ","باقی","استعمال شدہ","پروفائل","آپ کی پروفائل","پروفائل تصویر شامل کریں","پروفائل تصویر بدلیں","ڈارک موڈ","لائٹ تھیم","ڈارک تھیم","سب","روزانہ","ہفتہ وار","ماہانہ","ایک بار","لین دین","ترتیبات","تجزیہ","کھاتہ","زمرے","نقد","نیٹ بینکنگ","ڈیبٹ کارڈ","کریڈٹ کارڈ","موبائل والیٹ","دیگر","تاجر / دکان","خرچ کا نام","منصوبہ بند","درج شدہ","محفوظ شدہ","حسب ضرورت","فعال","آن","آف","سائن ان","سائن آؤٹ","پاس ورڈ","ای میل پتہ","آپ کا نام","اکاؤنٹ بنائیں","براہ کرم انتظار کریں…","پچھلا","اگلا","محفوظ کریں","آئٹم اپ ڈیٹ کریں"],
};

// Languages with smaller public terminology sets inherit a closely-related Indian
// script pack for operational controls while retaining their own navigation pack.
const RELATED_PACK = { brx: "hi", doi: "hi", ks: "ur", kok: "mr", mai: "hi", mni: "bn", ne: "hi", sa: "hi", sat: "bn", sd: "ur" };

const HINDI_PHRASES = {
  "Indian Daily Expense Tracker": "भारतीय दैनिक खर्च ट्रैकर", "Private household finance": "निजी घरेलू वित्त",
  "Every rupee,": "हर रुपया,", "clearly accounted for.": "पूरी तरह हिसाब में।",
  "Your expenses, merchant advances, credit limits and monthly budgets now stay securely connected to your account.": "आपके खर्च, व्यापारी अग्रिम, उधार सीमाएँ और मासिक बजट अब आपके खाते से सुरक्षित रूप से जुड़े रहते हैं।",
  "Account-protected ledger": "खाता-सुरक्षित बहीखाता", "Your records are separated from every other user.": "आपके रिकॉर्ड हर दूसरे उपयोगकर्ता से अलग रखे जाते हैं।",
  "Continue where you left off on any connected device.": "किसी भी जुड़े डिवाइस पर वहीं से जारी रखें जहाँ आपने छोड़ा था।",
  "Use at least 12 characters for your password.": "पासवर्ड में कम से कम 12 अक्षर रखें।", "Authentication mode": "प्रमाणीकरण का तरीका",
  "If that account exists, a reset link has been sent.": "यदि वह खाता मौजूद है, तो रीसेट लिंक भेज दिया गया है।",
  "Enter your email address first.": "पहले अपना ईमेल पता दर्ज करें।", "Password reset": "पासवर्ड रीसेट", "Account recovery": "खाता पुनर्प्राप्ति",
  "Reset your password": "अपना पासवर्ड रीसेट करें", "New password": "नया पासवर्ड", "Set new password": "नया पासवर्ड सेट करें", "Return to sign in": "साइन इन पर लौटें",
  "Primary navigation": "मुख्य नेविगेशन", "Mobile navigation": "मोबाइल नेविगेशन", "Navigation menu": "नेविगेशन मेन्यू",
  "Open navigation menu": "नेविगेशन मेन्यू खोलें", "Close navigation menu": "नेविगेशन मेन्यू बंद करें", "Close menu": "मेन्यू बंद करें",
  "A clear view of today, this month, and what comes next.": "आज, इस महीने और आगे का स्पष्ट विवरण।",
  "Plan household essentials separately from your expense ledger.": "घरेलू ज़रूरतों की योजना खर्च बही से अलग बनाएँ।",
  "Keep every rupee clear and accounted for.": "हर रुपये का स्पष्ट हिसाब रखें।", "Available to spend": "खर्च के लिए उपलब्ध",
  "Advance usage": "अग्रिम उपयोग", "Credit usage": "उधार उपयोग", "advance defined": "निर्धारित अग्रिम", "credit limit defined": "निर्धारित उधार सीमा",
  "Spending mix": "खर्च का मिश्रण", "Top categories for this month": "इस महीने की प्रमुख श्रेणियाँ", "Latest activity": "हाल की गतिविधि",
  "View all": "सभी देखें", "No expenses found": "कोई खर्च नहीं मिला", "Try another filter or log a new expense.": "दूसरा फ़िल्टर आज़माएँ या नया खर्च दर्ज करें।",
  "Search expenses": "खर्च खोजें", "Filter by payment method": "भुगतान तरीके से फ़िल्टर करें", "All payment methods": "सभी भुगतान तरीके",
  "Classify the Spending": "खर्च का वर्गीकरण करें", "Choose the broad category first, then the specific sub-category.": "पहले मुख्य श्रेणी, फिर उप-श्रेणी चुनें।",
  "Add the Expense Details": "खर्च का विवरण जोड़ें", "Only the amount and date are required.": "केवल राशि और तारीख आवश्यक हैं।",
  "Quick amount": "त्वरित राशि", "Merchant and optional details": "व्यापारी और वैकल्पिक विवरण", "Planned expense reminder": "नियोजित खर्च अनुस्मारक",
  "Reminder note": "अनुस्मारक नोट", "Notify me inside Ledger": "बहीखाते में सूचित करें", "No reminder": "कोई अनुस्मारक नहीं",
  "Save planned expense": "नियोजित खर्च सहेजें", "Review and save": "समीक्षा करके सहेजें", "Edit expense": "खर्च संपादित करें", "Plan expense": "खर्च की योजना बनाएँ",
  "Choose expense date": "खर्च की तारीख चुनें", "Close calendar": "कैलेंडर बंद करें", "Selected date": "चुनी हुई तारीख", "No entries on this date yet.": "इस तारीख पर अभी कोई प्रविष्टि नहीं है।",
  "Upcoming reminders": "आगामी अनुस्मारक", "Planned expense alerts": "नियोजित खर्च अलर्ट", "Audit history": "ऑडिट इतिहास", "Archived values": "संग्रहित मान",
  "Monthly Grocery List": "मासिक किराना सूची", "Build your list": "अपनी सूची बनाएँ", "Add a grocery item": "किराना वस्तु जोड़ें", "Item name": "वस्तु का नाम",
  "Quantity": "मात्रा", "Unit": "इकाई", "Unit price": "इकाई मूल्य", "Total cost": "कुल लागत", "Add to monthly list": "मासिक सूची में जोड़ें",
  "Included this month": "इस महीने शामिल", "Skipped this month": "इस महीने छोड़ा", "Mark bought": "खरीदा चिह्नित करें", "Bought": "खरीदा",
  "Share on WhatsApp": "व्हाट्सऐप पर साझा करें", "Copy previous month": "पिछला महीना कॉपी करें", "Search this monthly list": "इस मासिक सूची में खोजें",
  "Language": "भाषा", "App language": "ऐप की भाषा", "Appearance": "रूप-रंग", "Theme": "थीम", "Colour palette": "रंग पैलेट", "Look": "दिखावट",
  "Install Pocket Ledger": "पॉकेट लेजर इंस्टॉल करें", "Reset demo data": "डेमो डेटा रीसेट करें", "Data model": "डेटा मॉडल", "Account protected · securely synced": "खाता सुरक्षित · सुरक्षित रूप से सिंक",
  "Welcome to Pocket Ledger": "पॉकेट लेजर में आपका स्वागत है", "Create your account": "अपना खाता बनाएँ", "Sign in to your ledger": "अपने बहीखाते में साइन इन करें",
  "Forgot password?": "पासवर्ड भूल गए?", "Create secure account": "सुरक्षित खाता बनाएँ", "Show password": "पासवर्ड दिखाएँ", "Hide password": "पासवर्ड छिपाएँ",
  "Skip to main content": "मुख्य सामग्री पर जाएँ", "Loading your secure ledger…": "आपका सुरक्षित बहीखाता लोड हो रहा है…", "Opening Pocket Ledger…": "पॉकेट लेजर खुल रहा है…",
};

function corePack(code) {
  return CORE_PACKS[code] || CORE_PACKS[RELATED_PACK[code]] || CORE_PACKS.en;
}

export function textDirection(code = "en") {
  return RTL_LANGUAGE_CODES.has(languageDetails(code).code) ? "rtl" : "ltr";
}

export function uiText(code = "en", english = "") {
  if (typeof english !== "string") return english;
  const brandedEnglish = english.replaceAll("Pocket Ledger", "NASAQ Ledger");
  const resolved = languageDetails(code).code;
  if (resolved === "en") return brandedEnglish;
  const trimmed = brandedEnglish.trim();
  if (!trimmed) return brandedEnglish;
  if (trimmed === "NASAQ Ledger") return "NASAQ Ledger";
  const navIndex = NAV_PACKS.en.indexOf(trimmed);
  if (navIndex >= 0) return (NAV_PACKS[resolved] || NAV_PACKS.en)[navIndex];
  const coreIndex = CORE_KEYS.indexOf(trimmed);
  if (coreIndex >= 0) return corePack(resolved)[coreIndex] || trimmed;
  if (resolved === "hi" && HINDI_PHRASES[trimmed]) return HINDI_PHRASES[trimmed];
  const summaryIndex = SUMMARY_PACKS.en.indexOf(trimmed);
  if (summaryIndex >= 0) return (SUMMARY_PACKS[resolved] || SUMMARY_PACKS[RELATED_PACK[resolved]] || SUMMARY_PACKS.en)[summaryIndex];
  const generatedKey = trimmed.replaceAll("Pocket Ledger", "NASAQ Ledger");
  if (GENERATED_UI_TRANSLATIONS[resolved]?.[generatedKey]) {
    const translated = GENERATED_UI_TRANSLATIONS[resolved][generatedKey];
    const localizedBrand = GENERATED_UI_TRANSLATIONS[resolved]["NASAQ Ledger"];
    return trimmed.includes("NASAQ Ledger") && localizedBrand ? translated.replaceAll(localizedBrand, "NASAQ Ledger") : translated;
  }
  return brandedEnglish;
}

export function translateDisplayText(code = "en", source = "") {
  const resolved = languageDetails(code).code;
  if (typeof source !== "string") return source;
  if (resolved === "en") return source.replaceAll("Pocket Ledger", "NASAQ Ledger");
  const exact = uiText(resolved, source);
  if (exact !== source) return exact;
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  const body = source.slice(leading.length, source.length - trailing.length);
  const longDate = body.match(/^(?:(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+)?(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})(.*)$/);
  if (longDate) {
    const monthIndex = ["January","February","March","April","May","June","July","August","September","October","November","December"].indexOf(longDate[3]);
    const date = new Date(Date.UTC(Number(longDate[4]), monthIndex, Number(longDate[2])));
    const localized = new Intl.DateTimeFormat(languageDetails(resolved).locale, { ...(longDate[1] ? { weekday: "long" } : {}), day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
    return `${leading}${localized}${longDate[5]}${trailing}`;
  }
  const localizeMonth = (value) => {
    const match = value.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})(.*)$/);
    if (!match) return value;
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"].indexOf(match[1]);
    const localized = new Intl.DateTimeFormat(languageDetails(resolved).locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(Number(match[2]), month, 1)));
    return `${localized}${match[3]}`;
  };
  const parts = body.split(/(\s*[·:|—]\s*)/);
  let changed = false;
  const translated = parts.map((part) => {
    if (/^[\s·:|—]+$/.test(part)) return part;
    const value = localizeMonth(uiText(resolved, part.trim()));
    if (value !== part.trim()) changed = true;
    return part.replace(part.trim(), value);
  }).join("");
  if (changed) return `${leading}${translated}${trailing}`;
  const localizedMonth = localizeMonth(body);
  if (localizedMonth !== body) return `${leading}${localizedMonth}${trailing}`;
  return source;
}

export function formatLocalizedNumber(value, code = "en", options = {}) {
  try { return new Intl.NumberFormat(languageDetails(code).locale, options).format(Number(value) || 0); }
  catch { return new Intl.NumberFormat("en-IN", options).format(Number(value) || 0); }
}

export function formatLocalizedINR(value, code = "en") {
  return formatLocalizedNumber(value, code, { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export function languageDetails(code = "en") {
  return INDIAN_LANGUAGES.find((language) => language.code === code) || INDIAN_LANGUAGES[0];
}

export function navText(code, key) {
  const index = NAV_KEYS.indexOf(key);
  return (NAV_PACKS[code] || NAV_PACKS.en)[index] || key;
}

export function grocerySummaryText(code, key) {
  const index = ["included", "purchased", "skipped", "estimated"].indexOf(key);
  return (SUMMARY_PACKS[code] || SUMMARY_PACKS.en)[index] || key;
}

export function localizedMonthLabel(monthKey, code = "en") {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  try {
    return new Intl.DateTimeFormat(languageDetails(code).locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  }
}

export function groceryShareText(items, monthKey, code = "en") {
  const included = items.filter((item) => item.included);
  const groups = included.reduce((result, item) => {
    (result[item.groupName] ||= []).push(item);
    return result;
  }, {});
  const lines = [`🛒 NASAQ Ledger — ${localizedMonthLabel(monthKey, code)} ${navText(code, "groceries")}`, ""];
  Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).forEach(([group, groupItems]) => {
    lines.push(`*${group}*`);
    groupItems.forEach((item) => lines.push(`${item.purchased ? "✅" : "•"} ${item.name} — ${item.quantity} ${item.unit}`));
    lines.push("");
  });
  lines.push("Prices intentionally excluded · Shared from NASAQ Ledger");
  return lines.join("\n");
}
