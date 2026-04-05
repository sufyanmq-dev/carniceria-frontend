import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Poppins', sans-serif" }, // títulos
        body: { value: "'Inter', sans-serif" }, // texto base
      },
      colors: {
        brand: {
          50: { value: "#FFF5F5" },
          100: { value: "#FED7D7" },
          200: { value: "#FEB2B2" },
          300: { value: "#FC8181" },
          400: { value: "#F56565" },
          500: { value: "#E53E3E" },
          600: { value: "#C53030" },
          700: { value: "#9B2C2C" },
          800: { value: "#822727" },
          900: { value: "#63171B" },
        },
        neutral: {
          50: { value: "#F9FAFB" },
          100: { value: "#F3F4F6" },
          200: { value: "#E5E7EB" },
          300: { value: "#D1D5DB" },
          400: { value: "#9CA3AF" },
          500: { value: "#6B7280" },
          600: { value: "#4B5563" },
          700: { value: "#374151" },
          800: { value: "#1F2937" },
          900: { value: "#111827" },
        },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
      },
      space: {
        1: { value: "0.25rem" },
        2: { value: "0.5rem" },
        3: { value: "0.75rem" },
        4: { value: "1rem" },
        5: { value: "1.25rem" },
        6: { value: "1.5rem" },
        8: { value: "2rem" },
        10: { value: "2.5rem" },
        12: { value: "3rem" },
        16: { value: "4rem" },
      },
      radii: {
        sm: { value: "0.375rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.75rem" },
        xl: { value: "1rem" },
        full: { value: "9999px" },
      },
    },

    semanticTokens: {
      colors: {
        // fondos
        "bg.app": {
          value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.900}" },
        },
        "bg.surface": {
          value: { base: "white", _dark: "{colors.neutral.800}" },
        },
        "bg.subtle": {
          value: {
            base: "{colors.neutral.100}",
            _dark: "{colors.neutral.700}",
          },
        },

        // textos
        "text.primary": {
          value: { base: "{colors.neutral.900}", _dark: "white" },
        },
        "text.secondary": {
          value: {
            base: "{colors.neutral.500}",
            _dark: "{colors.neutral.400}",
          },
        },
        "text.muted": {
          value: {
            base: "{colors.neutral.400}",
            _dark: "{colors.neutral.500}",
          },
        },

        // bordes
        "border.default": {
          value: {
            base: "{colors.neutral.200}",
            _dark: "{colors.neutral.700}",
          },
        },
        "border.strong": {
          value: {
            base: "{colors.neutral.300}",
            _dark: "{colors.neutral.600}",
          },
        },

        // colores principales
        "brand.solid": {
          value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" },
        },
        "brand.subtle": {
          value: { base: "{colors.brand.50}", _dark: "{colors.brand.900}" },
        },
        "brand.text": {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" },
        },

        // sidebar
        "sidebar.bg": {
          value: { base: "white", _dark: "{colors.neutral.900}" },
        },
        "sidebar.border": {
          value: {
            base: "{colors.neutral.200}",
            _dark: "{colors.neutral.700}",
          },
        },
        "sidebar.active.bg": {
          value: { base: "{colors.brand.50}", _dark: "{colors.neutral.800}" },
        },
        "sidebar.active.text": {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" },
        },
        "sidebar.hover.bg": {
          value: {
            base: "{colors.neutral.100}",
            _dark: "{colors.neutral.800}",
          },
        },
      },
    },
  },
});

// sistema de diseño base (chakra + config custom)
export const system = createSystem(defaultConfig, config);
