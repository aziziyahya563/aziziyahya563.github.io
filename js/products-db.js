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
    // PC BUILD COMPONENTS
    // ==========================================
    cpu_i7_8700k: {
        name: "[CPU] Intel Core i7-8700K",
        shopeeUrl: "https://s.shopee.com.my/3LLYnKFeyp",
        tiktokUrl: "#"
    },
    cpu_r5_3600: {
        name: "[CPU] AMD Ryzen 5 3600",
        shopeeUrl: "https://s.shopee.com.my/3B28b1GIJo",
        tiktokUrl: "#"
    },
    mobo_msi_z370: {
        name: "[Mobo] MSI Z370 SLI Plus",
        shopeeUrl: "https://s.shopee.com.my/30iiOiGven",
        tiktokUrl: "#"
    },
    mobo_gigabyte_b450i: {
        name: "[Mobo] Gigabyte B450I AORUS PRO WIFI",
        shopeeUrl: "https://s.shopee.com.my/2qPICPHYzm",
        tiktokUrl: "#"
    },
    hdd_wd_blue_6tb: {
        name: "[HDD] WD Blue 6TB",
        shopeeUrl: "https://s.shopee.com.my/2g5s06ICKl",
        tiktokUrl: "#"
    },
    psu_1stplayer_sfx_650w: {
        name: "[PSU] 1st Player SFX 650W 80+ Gold Full Modular",
        shopeeUrl: "https://s.shopee.com.my/LhxD8vFJc",
        tiktokUrl: "#"
    },
    gpu_zotac_gtx1070: {
        name: "[GPU] ZOTAC GTX 1070 AMP Dual Fan",
        shopeeUrl: "https://s.shopee.com.my/9pZ2XeYhCa",
        tiktokUrl: "#"
    },
    case_deepcool_ch160: {
        name: "[PC Case] Deepcool CH160",
        shopeeUrl: "https://s.shopee.com.my/9fFcLLZKXZ",
        tiktokUrl: "#"
    },
    heatsink_m2_aluminum: {
        name: "[SSD Heatsink] Aluminum Heatsink for M.2 NGFF NVMe PCIe 2280 SSD",
        shopeeUrl: "https://s.shopee.com.my/9UwC92ZxsY",
        tiktokUrl: "#"
    },
    wifi_tplink_ax3000: {
        name: "[WiFi Card] TP-Link AX3000 Wi-Fi 6 & Bluetooth 5.2 PCIe Adapter",
        shopeeUrl: "https://s.shopee.com.my/9KclwjabDX",
        tiktokUrl: "#"
    },
    adapter_typee_usb: {
        name: "[Adapter] Motherboard Type-E USB Adapter (Female to 19-Pin Male)",
        shopeeUrl: "https://s.shopee.com.my/W1NPRubyf",
        tiktokUrl: "#"
    },
    adapter_usb3_to_usb2: {
        name: "[Adapter] 20-Pin USB 3.0 to 9-Pin USB 2.0 Converter Adapter",
        shopeeUrl: "https://s.shopee.com.my/156oWwVza",
        tiktokUrl: "#"
    },
    adapter_m2_to_sata: {
        name: "[Adapter] M.2 NGFF to SATA3 Adapter Card Enclosure",
        shopeeUrl: "https://s.shopee.com.my/BOX0pvsed",
        tiktokUrl: "#"
    },
    fan_idcooling_df12025: {
        name: "[Fan] ID-Cooling DF-12025 ARGB Case Fan",
        shopeeUrl: "https://s.shopee.com.my/50Tml9WAZn",
        tiktokUrl: "#"
    },
    cooler_thermalright_pa120: {
        name: "[CPU Cooler] Thermalright P.A 120 SE",
        shopeeUrl: "https://s.shopee.com.my/6KyiSuNsn8",
        tiktokUrl: "https://vt.tiktok.com/ZS91cUCFt3LoF-fgsCr/"
    },
    ram_corsair_rgb: {
        name: "[RAM] Corsair Vengeance RGB Pro SL White ",
        shopeeUrl: "https://s.shopee.com.my/1gDKnkHslV",
        tiktokUrl: "#"
    },
    ssd_adata_sx8200: {
        name: "[SSD] Adata XPG SX8200 Pro",
        shopeeUrl: "https://s.shopee.com.my/1qWl03HFQW",
        tiktokUrl: "#"
    },
    case_inwin_101: {
        name: "[PC Case] InWin 101 PC Case",
        shopeeUrl: "https://s.shopee.com.my/5fj1fljzGU",
        tiktokUrl: "#"
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
