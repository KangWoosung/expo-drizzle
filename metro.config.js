const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql"); // <-- 요거 추가

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
