import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  Searchbar,
} from "react-native-paper";

export const darkMode = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#9258FF",
    accent: "#FFD506",
    background: "#1E1E1E",
    surface: "#121212",
    text: "#FFFFFF",
    disabled: "#666666",
    placeholder: "#AAAAAA",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
};

// export const BASE_URL = "https://livre.deno.dev";
export const BASE_URL = "https://20de-102-215-13-121.ngrok-free.app";

export const lightMode = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#9258FF",
    accent: "#FFA600",
    background: "#FFFFFF",
    surface: "#F2F2F2",
    text: "#1E1E1E",
    disabled: "#9B9B9B",
    placeholder: "#B3B3B3",
    backdrop: "rgba(30, 30, 30, 0.5)",
    onBackground: "#000",
  },
};

export const theme = lightMode;

export const cardColors = [
  { start: "#D7DDE8", end: "#757F9A" },
  { start: "#FFB88C", end: "#DE6262" },
  { start: "#FEB692", end: "#EA5455" },
  { start: "#6A85B6", end: "#BFD8D2" },
  { start: "#FF9D6C", end: "#BB4E75" },
  { start: "#A1A2B1", end: "#3E3F50" },
  { start: "#F7971E", end: "#FFD200" },
  { start: "#3E5151", end: "#DECBA4" },
  { start: "#B5B5B5", end: "#4A4A4A" },
  { start: "#4B79A1", end: "#283E51" },
  { start: "#FFB75E", end: "#ED8F03" },
  { start: "#FF5F6D", end: "#FFC371" },
  { start: "#FEB692", end: "#EA5455" },
  { start: "#C2E59C", end: "#64B3F4" },
  { start: "#FDC830", end: "#F37335" },
  { start: "#E44D26", end: "#F16529" },
  { start: "#D1913C", end: "#FFD194" },
  { start: "#52ACFF", end: "#FFE32C" },
  { start: "#C0C0C0", end: "#808080" },
  { start: "#FC5C7D", end: "#6A82FB" },
  { start: "#4DA0B0", end: "#D39D38" },
  { start: "#DBE6F6", end: "#C5796D" },
  { start: "#FFE29F", end: "#FFA99F" },
  { start: "#E0EAFC", end: "#CFDEF3" },
  { start: "#BBD2C5", end: "#536976" },
  { start: "#2BC0E4", end: "#EAECC6" },
  { start: "#F9D423", end: "#FF4E50" },
  { start: "#E8CBC0", end: "#636FA4" },
  { start: "#70A6C8", end: "#B5D5E5" },
  { start: "#F2994A", end: "#F2C94C" },
  { start: "#EAECC6", end: "#29647D" },
  { start: "#5F2C82", end: "#49A09D" },
  { start: "#FFE0F7", end: "#FEC4FF" },
  { start: "#003973", end: "#E5E5BE" },
  { start: "#DCE35B", end: "#45B649" },
  { start: "#6B2E39", end: "#C6DABF" },
  { start: "#FFB347", end: "#FFCC33" },
  { start: "#B4B4DA", end: "#4E4E7B" },
  { start: "#003973", end: "#91EAE4" },
  { start: "#E0C3FC", end: "#8EC5FC" },
  { start: "#D7DDE8", end: "#757F9A" },
  { start: "#FFB88C", end: "#DE6262" },
  { start: "#FEB692", end: "#EA5455" },
  { start: "#6A85B6", end: "#BFD8D2" },
  { start: "#FF9D6C", end: "#BB4E75" },
  { start: "#A1A2B1", end: "#3E3F50" },
  { start: "#F7971E", end: "#FFD200" },
  { start: "#3E5151", end: "#DECBA4" },
  { start: "#B5B5B5", end: "#4A4A4A" },
  { start: "#4B79A1", end: "#283E51" },
  { start: "#FFB75E", end: "#ED8F03" },
  { start: "#FF5F6D", end: "#FFC371" },
  { start: "#FEB692", end: "#EA5455" },
  { start: "#C2E59C", end: "#64B3F4" },
  { start: "#FDC830", end: "#F37335" },
  { start: "#E44D26", end: "#F16529" },
  { start: "#D1913C", end: "#FFD194" },
  { start: "#52ACFF", end: "#FFE32C" },
  { start: "#C0C0C0", end: "#808080" },
  { start: "#FC5C7D", end: "#6A82FB" },
  { start: "#4DA0B0", end: "#D39D38" },
  { start: "#DBE6F6", end: "#C5796D" },
  { start: "#FFE29F", end: "#FFA99F" },
  { start: "#E0EAFC", end: "#CFDEF3" },
  { start: "#BBD2C5", end: "#536976" },
  { start: "#2BC0E4", end: "#EAECC6" },
  { start: "#F9D423", end: "#FF4E50" },
  { start: "#E8CBC0", end: "#636FA4" },
  { start: "#70A6C8", end: "#B5D5E5" },
  { start: "#F2994A", end: "#F2C94C" },
  { start: "#EAECC6", end: "#29647D" },
  { start: "#5F2C82", end: "#49A09D" },
  { start: "#FFE0F7", end: "#FEC4FF" },
  { start: "#003973", end: "#E5E5BE" },
  { start: "#DCE35B", end: "#45B649" },
  { start: "#6B2E39", end: "#C6DABF" },
  { start: "#FFB347", end: "#FFCC33" },
  { start: "#B4B4DA", end: "#4E4E7B" },
  { start: "#003973", end: "#91EAE4" },
  { start: "#E0C3FC", end: "#8EC5FC" },
];

export const bgColors = [
  "#8a8cc2",
  "#f093fb",
  "#b8e994",
  "#7ed6df",
  "#f6b93b",
  "#e66767",
  "#485460",
  "#1e272e",
  "#dcdde1",
  "#3c6382",
  "#ffb8b8",
  "#ff9ff3",
  "#feca57",
  "#ff6b6b",
  "#a29bfe",
  "#dff9fb",
  "#bdc3c7",
  "#00cec9",
  "#eccc68",
  "#ffa502",
  "#7f8fa6",
  "#70a1ff",
  "#2ed573",
  "#ffbe76",
  "#4b4b4b",
  "#f5cd79",
  "#00d2d3",
  "#eb2f06",
  "#8c7ae6",
  "#fdcb6e",
  "#d63031",
  "#e58e26",
  "#fd79a8",
  "#48dbfb",
  "#c8d6e5",
  "#6d4c41",
  "#FFA07A",
  "#FA8072",
  "#E9967A",
  "#F08080",
  "#CD5C5C",
  "#DC143C",
  "#B22222",
  "#8B0000",
  "#FFC0CB",
  "#FF69B4",
  "#FF1493",
  "#C71585",
  "#DB7093",
  "#FFA07A",
  "#FF7F50",
  "#FF6347",
  "#FF4500",
  "#FFD700",
  "#FFFF00",
  "#FFA500",
];

export const readerThemes = [
  //Default Theme
  { backgroundColor: "#1E1E1E", textColor: "white" },
  // Theme 1 - white background, black text
  { backgroundColor: "#FFFFFF", textColor: "#000000" },

  // Theme 2 - black background, white text
  { backgroundColor: "#000000", textColor: "#FFFFFF" },

  // Theme 3 - light gray background, dark gray text
  { backgroundColor: "#F6F6F6", textColor: "#4A4A4A" },

  // Theme 4 - light blue background, dark blue text
  { backgroundColor: "#E6F5FF", textColor: "#005A9C" },

  // Theme 5 - light green background, dark green text
  { backgroundColor: "#E9F8E7", textColor: "#006633" },

  // Theme 6 - light yellow background, dark yellow text
  { backgroundColor: "#FFF9E6", textColor: "#CC6600" },

  // Theme 7 - light purple background, dark purple text
  { backgroundColor: "#F7E7F9", textColor: "#7D2175" },

  // // Theme 8 - light orange background, dark orange text
  // { backgroundColor: "#FFEFE5", textColor: "#FF6600" },

  // // Theme 9 - light pink background, dark pink text
  // { backgroundColor: "#FBEFFB", textColor: "#CC0066" },

  // // Theme 10 - light brown background, dark brown text
  // { backgroundColor: "#FAF3E8", textColor: "#663300" },
];

export const overlayColors = [
  "transparent",
  // "#F5F5F5",
  "#ECEFF1",
  "#F8BBD0",
  "#F0E68C",
  "#D7CCC8",
  "#E1BEE7",
  "#B3E5FC",
  "#C8E6C9",
];
