const LOCALE = "es-ES";
const CURRENCY = "EUR";

// Precio en euros: "28,50 €"
export const fmtPrice = (amount) =>
  new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
  }).format(Number(amount) || 0);

// Precio con unidad: "28,50 €/kg"
export const fmtPriceWithUnit = (price, unit = "ud") =>
  `${fmtPrice(price)}/${unit}`;

// Cantidad con unidad: "1,5 kg" o "3 ud"
export const fmtQuantity = (qty, unit = "ud") => `${qty} ${unit}`;

// Fecha corta: "12 jun 2025"
export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Fecha larga: "12 junio 2025"
export const fmtDateLong = (iso) =>
  new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Fecha sin año: "12 jun"
export const fmtDateShort = (iso) =>
  new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
  });

// Fecha + hora: "12 jun 2025, 10:30"
export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ID corto de pedido: "#A1B2C3D4"
export const fmtOrderId = (id) => `#${id?.slice(0, 8).toUpperCase() ?? "—"}`;

// Iniciales de usuario: "sufyan" → "SU"
export const fmtInitials = (username) =>
  username?.slice(0, 2).toUpperCase() ?? "??";
