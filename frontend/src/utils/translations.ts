export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    business_world: "Business World",
    simulation: "Simulation",
    analytics: "Analytics",
    ai_ceo: "AI CEO",
    reports: "Reports",
    settings: "Settings",
    business_health: "Business Health",
    annual_revenue: "Annual Revenue",
    monthly_profit: "Monthly Profit",
    system_wide_index: "System-wide operational index",
    gross_turnover: "Gross simulated billing turnover",
    net_returns: "Net returns after overheads"
  },
  es: {
    dashboard: "Tablero",
    business_world: "Mundo de Negocios",
    simulation: "Simulación",
    analytics: "Analítica",
    ai_ceo: "Director IA",
    reports: "Informes",
    settings: "Ajustes",
    business_health: "Salud del Negocio",
    annual_revenue: "Ingresos Anuales",
    monthly_profit: "Beneficio Mensual",
    system_wide_index: "Índice operativo del sistema",
    gross_turnover: "Facturación bruta simulada",
    net_returns: "Rendimientos netos tras gastos"
  },
  de: {
    dashboard: "Dashboard",
    business_world: "Geschäftswelt",
    simulation: "Simulation",
    analytics: "Analytik",
    ai_ceo: "KI CEO",
    reports: "Berichte",
    settings: "Einstellungen",
    business_health: "Geschäftsgesundheit",
    annual_revenue: "Jahresumsatz",
    monthly_profit: "Monatlicher Gewinn",
    system_wide_index: "Systemweiter Betriebsindex",
    gross_turnover: "Bruttoumsatz simuliert",
    net_returns: "Nettoerträge nach Gemeinkosten"
  }
};

export const translate = (key: string, lang: string): string => {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return dictionary[key] || TRANSLATIONS['en'][key] || key;
};
