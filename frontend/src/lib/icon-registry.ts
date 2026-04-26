import type { IconType } from "react-icons";
import * as FiIcons from "react-icons/fi";
import * as LuIcons from "react-icons/lu";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";

// Feather Icons
import {
    FiWifi, FiZap, FiDroplet, FiWind, FiSun, FiMoon,
    FiCamera, FiMapPin, FiPhone, FiShield, FiStar, FiHeart,
    FiUsers, FiKey, FiTrash2, FiCoffee, FiShoppingBag,
    FiClock, FiGlobe, FiHome, FiGift, FiMusic, FiNavigation, FiBookOpen,
} from "react-icons/fi";

// Lucide Icons
import {
    LuTent, LuLeaf, LuCar, LuFlame, LuMountain, LuWaves,
    LuTrees, LuBike, LuFish, LuBed, LuUmbrella,
    LuDog, LuBaby, LuThermometer, LuAirVent,
    LuUtensils, LuToilet,
} from "react-icons/lu";

// Bootstrap Icons
import {
    BiDrink,
    BiSolidFridge, BiSolidTree, BiSolidSun,
} from "react-icons/bi";

// Material Design Icons
import {
    MdOutlineFireplace, MdOutlineRestaurant, MdOutlineLocalParking,
    MdOutlinePets, MdOutlineRvHookup, MdOutlineKitchen,
    MdOutlineLocalLaundryService, MdOutlineAccessibility,
    MdOutlineElectricCar, MdOutlineSportsTennis,
    MdOutlineSpa, MdOutlineNightShelter,
} from "react-icons/md";

export interface IconEntry {
    key: string;
    label: string;
    tags: string[];
    Component: IconType;
}

function isIconComponent(value: unknown): value is IconType {
    return typeof value === "function";
}

function humanizeIconKey(key: string): string {
    return key
        .replace(/^[A-Z][a-z]?/, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();
}

function createAutoIconEntries(
    prefix: string,
    source: Record<string, unknown>,
    existingKeys: Set<string>,
): IconEntry[] {
    return Object.entries(source).reduce<IconEntry[]>((entries, [key, component]) => {
        if (!key.startsWith(prefix) || existingKeys.has(key) || !isIconComponent(component)) {
            return entries;
        }

        const Component: IconType = component;
            const label = humanizeIconKey(key);
            const words = label.toLowerCase().split(/\s+/).filter(Boolean);
            entries.push({
                key,
                label,
                tags: [key.toLowerCase(), ...words],
                Component,
            });

            return entries;
        }, []);
}

const CURATED_ICON_REGISTRY: IconEntry[] = [
    // Utilities
    { key: "FiZap", label: "Electricity", tags: ["electricity", "power", "bolt", "ไฟฟ้า"], Component: FiZap },
    { key: "FiDroplet", label: "Water", tags: ["water", "droplet", "tap", "น้ำ"], Component: FiDroplet },
    { key: "FiWifi", label: "Wi-Fi", tags: ["wifi", "internet", "wireless", "network"], Component: FiWifi },
    { key: "LuShower", label: "Shower", tags: ["shower", "bathroom", "wash", "ห้องอาบน้ำ"], Component: FiDroplet },
    { key: "LuToilet", label: "Toilet", tags: ["toilet", "restroom", "wc", "ห้องน้ำ"], Component: LuToilet },
    { key: "LuFlame", label: "Campfire", tags: ["fire", "campfire", "flame", "bonfire", "ไฟแคมป์"], Component: LuFlame },
    { key: "MdOutlineFireplace", label: "Fireplace", tags: ["fireplace", "fire", "warm", "เตาผิง"], Component: MdOutlineFireplace },
    { key: "FiWind", label: "Ventilation", tags: ["wind", "air", "fan", "ventilation", "อากาศ"], Component: FiWind },
    { key: "LuAirVent", label: "AC", tags: ["ac", "air conditioning", "cool", "แอร์"], Component: LuAirVent },
    { key: "LuThermometer", label: "Hot Water", tags: ["hot water", "heater", "temperature", "น้ำร้อน"], Component: LuThermometer },
    { key: "FiClock", label: "24 Hours", tags: ["24 hours", "open", "time", "clock", "เปิดตลอด"], Component: FiClock },
    { key: "FiGlobe", label: "Global Access", tags: ["global", "world", "international", "ทั่วโลก"], Component: FiGlobe },

    // Transport & Parking
    { key: "LuCar", label: "Parking", tags: ["car", "parking", "drive", "จอดรถ"], Component: LuCar },
    { key: "LuParking", label: "Parking Lot", tags: ["parking", "lot", "park", "ลานจอดรถ"], Component: MdOutlineLocalParking },
    { key: "MdOutlineLocalParking", label: "Paid Parking", tags: ["parking", "paid", "จอดรถ"], Component: MdOutlineLocalParking },
    { key: "MdOutlineElectricCar", label: "EV Charger", tags: ["electric", "ev", "charger", "ชาร์จรถ"], Component: MdOutlineElectricCar },
    { key: "MdOutlineRvHookup", label: "RV Hookup", tags: ["rv", "caravan", "hookup"], Component: MdOutlineRvHookup },
    { key: "LuBike", label: "Bicycle", tags: ["bike", "bicycle", "cycle", "จักรยาน"], Component: LuBike },
    { key: "FiNavigation", label: "Easy Navigation", tags: ["navigation", "gps", "direction", "ทางนำทาง"], Component: FiNavigation },

    // Food & Drink
    { key: "MdOutlineRestaurant", label: "Restaurant", tags: ["restaurant", "food", "dining", "ร้านอาหาร"], Component: MdOutlineRestaurant },
    { key: "FiCoffee", label: "Cafe", tags: ["coffee", "cafe", "drink", "กาแฟ"], Component: FiCoffee },
    { key: "LuUtensils", label: "Kitchen", tags: ["kitchen", "cook", "utensils", "ครัว"], Component: LuUtensils },
    { key: "MdOutlineKitchen", label: "Full Kitchen", tags: ["kitchen", "cooking", "appliances", "ครัวครบ"], Component: MdOutlineKitchen },
    { key: "BiSolidFridge", label: "Refrigerator", tags: ["fridge", "refrigerator", "cold", "ตู้เย็น"], Component: BiSolidFridge },
    { key: "LuCup", label: "Drinks", tags: ["cup", "drink", "beverage", "เครื่องดื่ม"], Component: BiDrink },
    { key: "BiDrink", label: "Bar", tags: ["bar", "drink", "cocktail", "บาร์"], Component: BiDrink },
    { key: "FiHome", label: "Common Area", tags: ["home", "common area", "shared", "พื้นที่ส่วนกลาง"], Component: FiHome },

    // Accommodation
    { key: "LuTent", label: "Tent", tags: ["tent", "camping", "shelter", "เตนท์"], Component: LuTent },
    { key: "LuBed", label: "Bed", tags: ["bed", "sleep", "rest", "เตียง"], Component: LuBed },
    { key: "MdOutlineNightShelter", label: "Shelter", tags: ["shelter", "hut", "cabin", "ที่พัก"], Component: MdOutlineNightShelter },

    // Nature & Scenery
    { key: "LuMountain", label: "Mountain View", tags: ["mountain", "view", "scenery", "วิวเขา"], Component: LuMountain },
    { key: "LuWaves", label: "Waterfront", tags: ["water", "lake", "river", "sea", "ริมน้ำ"], Component: LuWaves },
    { key: "LuTree", label: "Forest", tags: ["tree", "forest", "nature", "ป่า"], Component: LuTrees },
    { key: "LuLeaf", label: "Nature", tags: ["leaf", "green", "eco", "nature", "ธรรมชาติ"], Component: LuLeaf },
    { key: "BiSolidTree", label: "Trees", tags: ["trees", "forest", "woods", "ต้นไม้"], Component: BiSolidTree },
    { key: "FiSun", label: "Sunny", tags: ["sun", "sunny", "bright", "แดด"], Component: FiSun },
    { key: "BiSolidSun", label: "Sunrise View", tags: ["sunrise", "sunset", "view", "วิวพระอาทิตย์"], Component: BiSolidSun },
    { key: "FiMoon", label: "Night View", tags: ["moon", "night", "star", "วิวกลางคืน"], Component: FiMoon },
    { key: "LuUmbrella", label: "Shaded Area", tags: ["umbrella", "shade", "cover", "ร่มเงา"], Component: LuUmbrella },

    // Activities & Sports
    { key: "BiCampfire", label: "BBQ Area", tags: ["bbq", "grill", "fire", "campfire", "บาร์บีคิว"], Component: LuFlame },
    { key: "LuFish", label: "Fishing", tags: ["fish", "fishing", "pond", "ตกปลา"], Component: LuFish },
    { key: "MdOutlineSportsTennis", label: "Sports", tags: ["sport", "tennis", "activity", "กีฬา"], Component: MdOutlineSportsTennis },
    { key: "BiPool", label: "Swimming Pool", tags: ["pool", "swim", "water", "สระว่ายน้ำ"], Component: LuWaves },
    { key: "FiCamera", label: "Photo Spot", tags: ["photo", "camera", "scenic", "จุดถ่ายรูป"], Component: FiCamera },
    { key: "FiMusic", label: "Live Music", tags: ["music", "live", "band", "ดนตรีสด"], Component: FiMusic },

    // People & Groups
    { key: "FiUsers", label: "Group Friendly", tags: ["group", "family", "people", "กลุ่ม"], Component: FiUsers },
    { key: "LuBaby", label: "Kid Friendly", tags: ["baby", "kids", "children", "family", "เด็ก"], Component: LuBaby },
    { key: "LuDog", label: "Pet Friendly", tags: ["dog", "pet", "animal", "สัตว์เลี้ยง"], Component: LuDog },
    { key: "MdOutlinePets", label: "Pets Welcome", tags: ["pet", "dog", "cat", "animal", "สัตว์"], Component: MdOutlinePets },
    { key: "MdOutlineAccessibility", label: "Accessible", tags: ["accessible", "wheelchair", "disable", "ทุพพลภาพ"], Component: MdOutlineAccessibility },

    // Facilities & Services
    { key: "FiShoppingBag", label: "Shop", tags: ["shop", "store", "buy", "ร้านค้า"], Component: FiShoppingBag },
    { key: "MdOutlineLocalLaundryService", label: "Laundry", tags: ["laundry", "wash", "clean", "ซักรีด"], Component: MdOutlineLocalLaundryService },
    { key: "LuFirstAid", label: "First Aid", tags: ["first aid", "medical", "health", "ปฐมพยาบาล"], Component: FiShield },
    { key: "FiPhone", label: "Phone Signal", tags: ["phone", "signal", "cell", "สัญญาณ"], Component: FiPhone },
    { key: "FiShield", label: "Security", tags: ["security", "safe", "guard", "ความปลอดภัย"], Component: FiShield },
    { key: "FiKey", label: "Check-in", tags: ["key", "checkin", "door", "เช็คอิน"], Component: FiKey },
    { key: "FiMapPin", label: "Location", tags: ["map", "location", "pin", "place", "แผนที่"], Component: FiMapPin },
    { key: "LuTrash2", label: "Waste Disposal", tags: ["trash", "waste", "bin", "garbage", "ถังขยะ"], Component: FiTrash2 },
    { key: "MdOutlineSpa", label: "Spa / Wellness", tags: ["spa", "wellness", "relax", "massage", "สปา"], Component: MdOutlineSpa },
    { key: "FiGift", label: "Gift Shop", tags: ["gift", "shop", "souvenir", "ของฝาก"], Component: FiGift },
    { key: "FiBookOpen", label: "Guidebook", tags: ["guide", "book", "manual", "คู่มือ"], Component: FiBookOpen },

    // Highlights
    { key: "FiStar", label: "Highlight", tags: ["star", "highlight", "featured", "จุดเด่น"], Component: FiStar },
    { key: "FiHeart", label: "Favourite", tags: ["heart", "love", "favourite", "สิ่งที่ชอบ"], Component: FiHeart },
];

const existingKeys = new Set(CURATED_ICON_REGISTRY.map((entry) => entry.key));

const AUTO_ICON_REGISTRY: IconEntry[] = [
    ...createAutoIconEntries("Fi", FiIcons, existingKeys),
    ...createAutoIconEntries("Lu", LuIcons, existingKeys),
    ...createAutoIconEntries("Bi", BiIcons, existingKeys),
    ...createAutoIconEntries("Md", MdIcons, existingKeys),
];

export const ICON_REGISTRY: IconEntry[] = [
    ...CURATED_ICON_REGISTRY,
    ...AUTO_ICON_REGISTRY,
];

export function searchIcons(query: string): IconEntry[] {
    if (!query.trim()) return ICON_REGISTRY;
    const q = query.toLowerCase().trim();
    return ICON_REGISTRY.filter(
        (e) =>
            e.label.toLowerCase().includes(q) ||
            e.tags.some((t) => t.toLowerCase().includes(q)),
    );
}
