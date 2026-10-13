import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Michroma', 'Geist', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Michroma display scale (weight 400 only)
        "display-6xl": ["64px", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-5xl": ["52px", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-4xl": ["42px", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-3xl": ["34px", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "display-2xl": ["28px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-xl": ["22px", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-lg": ["18px", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "display-base": ["14px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        // Semantic application type styles
        "display-page": ["34px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-metric": ["22px", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "heading-lg": ["24px", { lineHeight: "30px", fontWeight: "600" }],
        "heading-md": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "heading-sm": ["16px", { lineHeight: "22px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "body-md": ["14px", { lineHeight: "20px" }],
        "body-sm": ["12px", { lineHeight: "16px" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500", letterSpacing: "0" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500", letterSpacing: "0" }],
        caption: ["11px", { lineHeight: "16px", letterSpacing: "0" }],
      },
      backgroundColor: {
        page: "hsl(var(--surface-page-background))",
        container: "hsl(var(--surface-container))",
        raised: "hsl(var(--surface-raised))",
        "raised-2": "hsl(var(--surface-raised-x2))",
      },
      textColor: {
        secondary: {
          DEFAULT: "hsl(var(--text-secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: "hsl(var(--text-tertiary))",
        quaternary: "hsl(var(--text-quaternary))",
        "on-color": "hsl(var(--text-on-color))",
        success: "hsl(var(--feedback-success-content))",
        info: "hsl(var(--feedback-info-content))",
        warning: "hsl(var(--feedback-warning-content))",
        error: "hsl(var(--feedback-error-content))",
        icon: {
          primary: "hsl(var(--icon-primary))",
          secondary: "hsl(var(--icon-secondary))",
          tertiary: "hsl(var(--icon-tertiary))",
          quaternary: "hsl(var(--icon-quaternary))",
          "on-color": "hsl(var(--icon-on-color))",
        },
      },
      borderColor: {
        default: "hsl(var(--stroke-default))",
        active: "hsl(var(--stroke-active))",
        muted: {
          DEFAULT: "hsl(var(--stroke-muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        disabled: "hsl(var(--stroke-disabled))",
      },
      colors: {
        // Translucent semantic strokes — do not use with /opacity modifiers
        stroke: {
          default: "hsl(var(--stroke-default))",
          active: "hsl(var(--stroke-active))",
          muted: "hsl(var(--stroke-muted))",
          disabled: "hsl(var(--stroke-disabled))",
          "on-color": "hsl(var(--stroke-on-color))",
        },
        action: {
          DEFAULT: "hsl(var(--surface-action))",
          primary: {
            DEFAULT: "hsl(var(--action-primary-default))",
            hover: "hsl(var(--action-primary-hover))",
            focused: "hsl(var(--action-primary-focused))",
            disabled: "hsl(var(--action-primary-disabled))",
            content: "hsl(var(--action-primary-content))",
          },
          secondary: {
            DEFAULT: "hsl(var(--action-secondary-default))",
            hover: "hsl(var(--action-secondary-hover))",
            focused: "hsl(var(--action-secondary-focused))",
            disabled: "hsl(var(--action-secondary-disabled))",
          },
          tertiary: {
            DEFAULT: "hsl(var(--action-tertiary-default))",
            hover: "hsl(var(--action-tertiary-hover))",
            focused: "hsl(var(--action-tertiary-focused))",
          },
        },
        feedback: {
          success: {
            DEFAULT: "hsl(var(--feedback-success-content))",
            icon: "hsl(var(--feedback-success-icon))",
            stroke: "hsl(var(--feedback-success-stroke))",
            background: "hsl(var(--feedback-success-background))",
          },
          info: {
            DEFAULT: "hsl(var(--feedback-info-content))",
            icon: "hsl(var(--feedback-info-icon))",
            stroke: "hsl(var(--feedback-info-stroke))",
            background: "hsl(var(--feedback-info-background))",
          },
          neutral: {
            DEFAULT: "hsl(var(--feedback-neutral-content))",
            icon: "hsl(var(--feedback-neutral-icon))",
            stroke: "hsl(var(--feedback-neutral-stroke))",
            background: "hsl(var(--feedback-neutral-background))",
          },
          warning: {
            DEFAULT: "hsl(var(--feedback-warning-content))",
            icon: "hsl(var(--feedback-warning-icon))",
            stroke: "hsl(var(--feedback-warning-stroke))",
            background: "hsl(var(--feedback-warning-background))",
          },
          error: {
            DEFAULT: "hsl(var(--feedback-error-content))",
            icon: "hsl(var(--feedback-error-icon))",
            stroke: "hsl(var(--feedback-error-stroke))",
            background: "hsl(var(--feedback-error-background))",
          },
        },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--sidebar-muted))",
        },
        status: {
          "on-track": "hsl(var(--status-on-track))",
          "at-risk": "hsl(var(--status-at-risk))",
          critical: "hsl(var(--status-critical))",
          delayed: "hsl(var(--status-delayed))",
          completed: "hsl(var(--status-completed))",
        },
        priority: {
          p1: "hsl(var(--priority-p1))",
          p2: "hsl(var(--priority-p2))",
          p3: "hsl(var(--priority-p3))",
          p4: "hsl(var(--priority-p4))",
        },
        chart: {
          committed: "hsl(var(--chart-committed))",
          tentative: "hsl(var(--chart-tentative))",
          available: "hsl(var(--chart-available))",
          threshold: "hsl(var(--chart-threshold))",
        },
        surface: {
          elevated: "hsl(var(--surface-elevated))",
          sunken: "hsl(var(--surface-sunken))",
        },
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
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
