// module.exports = function (api) {
//     api.cache(true);
//     return {
//         presets: ['babel-preset-expo'],
//         plugins: [
//             'nativewind/babel',
//             'react-native-reanimated/plugin', // MUST be last
//         ],
//     };
// };

module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        ],
        plugins: [
            "react-native-reanimated/plugin",
        ],
    };
};