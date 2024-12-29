/*
2024-11-26 18:41:05

*/
// zustand 전역 스토어 생성
import { create } from "zustand";

// JS 사용자는 타입 선언과 펑션의 제네릭 구문 <Generic> 을 제거/무시하시면 됩니다.
export type ThemeState = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
}));
