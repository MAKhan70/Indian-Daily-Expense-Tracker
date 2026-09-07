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
  const lines = [`🛒 Pocket Ledger — ${localizedMonthLabel(monthKey, code)} ${navText(code, "groceries")}`, ""];
  Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).forEach(([group, groupItems]) => {
    lines.push(`*${group}*`);
    groupItems.forEach((item) => lines.push(`${item.purchased ? "✅" : "•"} ${item.name} — ${item.quantity} ${item.unit}`));
    lines.push("");
  });
  lines.push("Prices intentionally excluded · Shared from Pocket Ledger");
  return lines.join("\n");
}
