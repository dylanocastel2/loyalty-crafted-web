export interface BuiltinPage {
  key: string;
  label: string;
  path: string;
}

export const BUILTIN_PAGES: BuiltinPage[] = [
  { key: "index", label: "Home", path: "/" },
  { key: "gemeenten", label: "Gemeenten", path: "/gemeenten" },
  { key: "commercieel", label: "Commercieel", path: "/commercieel" },
  { key: "spaarsysteem", label: "Spaarsysteem", path: "/spaarsysteem" },
  { key: "klantcases", label: "Klantcases", path: "/klantcases" },
  { key: "support", label: "Support", path: "/support" },
  { key: "over-ons", label: "Over Ons", path: "/over-ons" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "demo", label: "Demo", path: "/demo" },
  { key: "branches", label: "Branches (overzicht)", path: "/branches" },
  { key: "branche-gemeenten", label: "Branche: Gemeenten", path: "/branches/gemeenten" },
  { key: "branche-horeca", label: "Branche: Horeca", path: "/branches/horeca" },
  { key: "branche-retail", label: "Branche: Retail", path: "/branches/retail" },
  { key: "branche-zorg", label: "Branche: Zorg", path: "/branches/zorg" },
  { key: "branche-winkeliersverenigingen", label: "Branche: Winkeliersverenigingen", path: "/branches/winkeliersverenigingen" },
];

export const getBuiltinPage = (key: string) => BUILTIN_PAGES.find((p) => p.key === key);
