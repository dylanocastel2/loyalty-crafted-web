export interface BuiltinPage {
  key: string;
  label: string;
  path: string;
}

export const BUILTIN_PAGES: BuiltinPage[] = [
  { key: "index", label: "Home", path: "/" },
  { key: "gemeenten", label: "Gemeenten", path: "/gemeenten" },
  { key: "commercieel", label: "Commercieel", path: "/commercieel" },
  { key: "spaarsystemen", label: "Spaarsystemen", path: "/spaarsystemen" },
  { key: "spaarprogramma", label: "Spaarprogramma", path: "/spaarprogramma" },
  { key: "klantcases", label: "Klantcases", path: "/klantcases" },
  { key: "support", label: "Support", path: "/support" },
  { key: "over-ons", label: "Over Ons", path: "/over-ons" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "demo", label: "Demo", path: "/demo" },
];

export const getBuiltinPage = (key: string) => BUILTIN_PAGES.find((p) => p.key === key);
