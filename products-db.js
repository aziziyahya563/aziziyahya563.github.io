/**
 * Central Product Database
 * Stores all affiliate links and product details in one place.
 * Usage: PRODUCTS.key_name
 */

const PRODUCTS = {
    // ==========================================
    // ARDUINO COMPONENTS
    // ==========================================
    arduino_uno: {
        name: "Arduino Uno (x1)",
        shopeeUrl: "https://s.shopee.com.my/8Kjm2fu9SG",
        tiktokUrl: "https://vt.tiktok.com/ZS91cBw5vD5NF-gLzZF/"
    },
    motor_driver_l293d: {
        name: "L293D Motor Driver Shield (x1)",
        shopeeUrl: "https://s.shopee.com.my/20piVMSC73",
        tiktokUrl: "https://vt.tiktok.com/ZS91cSrs3uKUh-Vv93W/"
    },
    chassis_kit_2wd: {
        name: "6V DC Motor Set Smart Robot Car Chassis Kit (x1)",
        shopeeUrl: "https://s.shopee.com.my/4VX3Tz8nKy",
        tiktokUrl: "https://vt.tiktok.com/ZS91cSx8GDjBa-qwY45/"
    },
    dc_motor_standard: {
        name: "Standard DC Motor (3-6V) (x1)",
        shopeeUrl: "https://s.shopee.com.my/3VeWIFZGoL",
        tiktokUrl: "https://vt.tiktok.com/ZS91cS3JoGdbN-K0DA5/"
    },
    servo_sg90: {
        name: "Servo Motor (SG90) (x1)",
        shopeeUrl: "https://s.shopee.com.my/2qOpUrhI8F",
        tiktokUrl: "https://vt.tiktok.com/ZS91cANdhxBX2-32Vut/"
    },
    battery_18650_x2: {
        name: "18650 Li-ion Batteries (x2)",
        shopeeUrl: "https://s.shopee.com.my/5VPafhCkzH",
        tiktokUrl: "https://vt.tiktok.com/ZS91cAM6Lj33C-BWL6N/"
    },
    sensor_ultrasonic: {
        name: "HC-SR04 Ultrasonic Sensor (x1)",
        shopeeUrl: "https://s.shopee.com.my/6VI7rZ84ap",
        tiktokUrl: "https://vt.tiktok.com/ZS91cAAPeC2cx-eTiIG/"
    },
    switch_power: {
        name: "Power Switch (x1)",
        shopeeUrl: "https://s.shopee.com.my/2qOpVChoX7",
        tiktokUrl: "https://vt.tiktok.com/ZS91cA5kpXpSp-QFHdc/"
    },
    battery_holder: {
        name: "Battery Holder (x1)",
        shopeeUrl: "https://s.shopee.com.my/1BGbW2luLi",
        tiktokUrl: "https://vt.tiktok.com/ZS91cA9jTd6de-4SyiK/"
    },
    dust_container: {
        name: "Dust Container (x1)",
        shopeeUrl: "#",
        tiktokUrl: "#"
    },
    wires_jumper: {
        name: "Jumper Wires & Connectors",
        shopeeUrl: "https://s.shopee.com.my/AKUqQqncwa",
        tiktokUrl: "https://vt.tiktok.com/ZS91cAgk4Hs25-eIFum/"
    },

    // ==========================================
    // DESK SETUP GEAR
    // ==========================================
    monitor_acer_vg270p: {
        name: "[Monitor] Acer VG270P",
        shopeeUrl: "https://s.shopee.com.my/qdlujKFDx",
        tiktokUrl: "https://vt.tiktok.com/ZS91cAwqBoHe3-4JeW9/"
    },
    headphone_cm_ch630: {
        name: "[Headphone] Cooler Master CH630",
        shopeeUrl: "https://s.shopee.com.my/3LL640XAA4",
        tiktokUrl: "#"
    },
    mouse_logitech_g304: {
        name: "[Mouse] Logitech G304",
        shopeeUrl: "https://s.shopee.com.my/60Ls4FvR82",
        tiktokUrl: "https://vt.tiktok.com/ZS91cD4ck7xG6-bXnZ9/"
    },
    keyboard_rk_h81: {
        name: "[Keyboard] Royal Kludge RK H81",
        shopeeUrl: "https://s.shopee.com.my/5VPbTLsOn8",
        tiktokUrl: "https://vt.tiktok.com/ZS91cUjoAyVcC-28OCz/"
    },
    controller_ds4: {
        name: "[Controller] DS4 OEM",
        shopeeUrl: "https://s.shopee.com.my/8fMdFPILFi",
        tiktokUrl: "https://vt.tiktok.com/ZS91cUUtGFprB-jdYvV/"
    },
    cooler_thermalright_pa120: {
        name: "[CPU Cooler] Thermalright P.A 120 SE",
        shopeeUrl: "https://s.shopee.com.my/6KyiSuNsn8",
        tiktokUrl: "https://vt.tiktok.com/ZS91cUCFt3LoF-fgsCr/"
    },
    ram_corsair_rgb: {
        name: "[RAM] Corsair Vengeance RGB Pro SL White ",
        shopeeUrl: "https://s.shopee.com.my/6VI8fE9maI",
        tiktokUrl: "#"
    },
    ssd_adata_sx8200: {
        name: "[SSD] Adata XPG SX8200 Pro",
        shopeeUrl: "https://s.shopee.com.my/3B1gh74XRK",
        tiktokUrl: "#"
    },
    case_inwin_101: {
        name: "[PC Case] InWin 101 PC Case",
        shopeeUrl: "https://s.shopee.com.my/5fj1fljzGU",
        tiktokUrl: "#"
    },
    desk_study: {
        name: "[Desk] Computer/ Study Desk",
        shopeeUrl: "https://s.shopee.com.my/5VPbTgwhdl",
        tiktokUrl: "https://vt.tiktok.com/ZS91cy6gB97y1-lLg2n/"
    },
    shelf_storage: {
        name: "[Desk Add-on] Tabletop Storage Shelf",
        shopeeUrl: "https://s.shopee.com.my/4fqUU4xdHk",
        tiktokUrl: "https://vt.tiktok.com/ZS91cyfXJ8XFU-8GjcN/"
    }
};

// Make it available globally if using modules, but for simple script tags it's already global.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRODUCTS;
}
