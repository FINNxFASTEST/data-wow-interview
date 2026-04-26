import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        theme: {
          danger: "hsl(var(--theme-danger) / <alpha-value>)",
          "nav-active-bg": "hsl(var(--theme-nav-active-bg) / <alpha-value>)",
          "nav-active-fg": "hsl(var(--theme-nav-active-fg) / <alpha-value>)",
          "dashboard-stat-success": "hsl(var(--theme-dashboard-stat-success) / <alpha-value>)",
          primary: "hsl(var(--theme-primary) / <alpha-value>)",
          "on-primary": "hsl(var(--theme-on-primary) / <alpha-value>)",
          body: "hsl(var(--theme-body-color) / <alpha-value>)",
          secondary: "hsl(var(--theme-secondary-color) / <alpha-value>)",
          emphasis: "hsl(var(--theme-emphasis) / <alpha-value>)",
          surface: "hsl(var(--theme-surface) / <alpha-value>)",
          "body-bg": "var(--theme-body-bg)",
          "muted-surface": "hsl(var(--theme-muted-surface) / <alpha-value>)",
          line: "hsl(var(--theme-border) / <alpha-value>)",
          "status-success-bg": "hsl(var(--theme-status-success-bg) / <alpha-value>)",
          "status-success-fg": "hsl(var(--theme-status-success-fg) / <alpha-value>)",
          "status-warn-bg": "hsl(var(--theme-status-warn-bg) / <alpha-value>)",
          "status-warn-fg": "hsl(var(--theme-status-warn-fg) / <alpha-value>)",
          "status-alert-bg": "hsl(var(--theme-status-alert-bg) / <alpha-value>)",
          "status-alert-fg": "hsl(var(--theme-status-alert-fg) / <alpha-value>)",
          "status-danger-bg": "hsl(var(--theme-status-danger-bg) / <alpha-value>)",
          "status-danger-fg": "hsl(var(--theme-status-danger-fg) / <alpha-value>)",
          "status-muted-bg": "hsl(var(--theme-status-muted-bg) / <alpha-value>)",
          "status-muted-fg": "hsl(var(--theme-status-muted-fg) / <alpha-value>)",
        },
      },
      boxShadow: {
        "theme-card": "var(--theme-shadow-card)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
