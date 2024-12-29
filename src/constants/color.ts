export const colors = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(20 14.3% 4.1%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(20 14.3% 4.1%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(20 14.3% 4.1%)",
    primary: "hsl(24 9.8% 10%)",
    primaryForeground: "hsl(60 9.1% 97.8%)",
    secondary: "hsl(60 4.8% 95.9%)",
    secondaryForeground: "hsl(24 9.8% 10%)",
    muted: "hsl(60 4.8% 95.9%)",
    mutedForeground: "hsl(25 5.3% 44.7%)",
    accent: "hsl(60 4.8% 95.9%)",
    accentForeground: "hsl(24 9.8% 10%)",
    destructive: "hsl(0 84.2% 60.2%)",
    destructiveForeground: "hsl(60 9.1% 97.8%)",
    border: "hsl(20 5.9% 90%)",
    input: "hsl(20 5.9% 90%)",
    ring: "hsl(20 14.3% 4.1%)",
    chart: {
      c1: "hsl(12 76% 61%)",
      c2: "hsl(173 58% 39%)",
      c3: "hsl(197 37% 24%)",
      c4: "hsl(43 74% 66%)",
      c5: "hsl(27 87% 67%)",
    },
  },
  dark: {
    background: "hsl(20 14.3% 4.1%)",
    foreground: "hsl(60 9.1% 97.8%)",
    card: "hsl(20 14.3% 4.1%)",
    cardForeground: "hsl(60 9.1% 97.8%)",
    popover: "hsl(20 14.3% 4.1%)",
    popoverForeground: "hsl(60 9.1% 97.8%)",
    primary: "hsl(60 9.1% 97.8%)",
    primaryForeground: "hsl(24 9.8% 10%)",
    secondary: "hsl(12 6.5% 15.1%)",
    secondaryForeground: "hsl(60 9.1% 97.8%)",
    muted: "hsl(12 6.5% 15.1%)",
    mutedForeground: "hsl(24 5.4% 63.9%)",
    accent: "hsl(12 6.5% 15.1%)",
    accentForeground: "hsl(60 9.1% 97.8%)",
    destructive: "hsl(0 62.8% 30.6%)",
    destructiveForeground: "hsl(60 9.1% 97.8%)",
    border: "hsl(12 6.5% 15.1%)",
    input: "hsl(12 6.5% 15.1%)",
    ring: "hsl(24 5.7% 82.9%)",
    chart: {
      c1: "hsl(220 70% 50%)",
      c2: "hsl(160 60% 45%)",
      c3: "hsl(30 80% 55%)",
      c4: "hsl(280 65% 60%)",
      c5: "hsl(340 75% 55%)",
    },
  },
} as const;

// 사용 예시
export const getColors = (colorScheme: "light" | "dark" | undefined) => {
  if (colorScheme === undefined) {
    return colors.light;
  }
  return colors[colorScheme];
};
