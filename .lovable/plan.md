

## Loyaltygroup B.V. Website — Implementation Plan

### Overview
Build a modern, Dutch-language SaaS website for Loyaltygroup B.V. with 9+ pages, audience-specific flows, and an admin CMS — all using their brand colors (#0784b6 / #08abd8) and uploaded logo.

### Pages & Navigation

**Header**: Logo (links to home) + uppercase nav: SPAARSYSTEMEN | SPAARPROGRAMMA | KLANTCASES | SUPPORT | OVER ONS | CONTACT | DEMO

1. **Homepage** — Hero with audience selector (Gemeenten / Commercieel), feature highlights (Maatwerk, Cross Platform, Gebruiksvriendelijk), CTA sections, footer
2. **Gemeenten page** — Tailored messaging for municipalities: stadspas, regelingen, lokale economie
3. **Commercieel page** — Tailored for businesses: klantenbinding, spaarpas, CRM tools
4. **Spaarsystemen** — Overview of loyalty system products (Online Spaarsysteem, Digitale Spaarpas, Klantenkaart, Apps, Cadeaukaarten)
5. **Spaarprogramma** — How the loyalty program works, benefits, integrations
6. **Klantcases** — Dynamic customer case studies (managed via admin)
7. **Support** — FAQ, contact info, support resources
8. **Over Ons** — Company story, in-house development, team values
9. **Contact** — Contact form + company details
10. **Demo** — Demo request form

### Admin System (Lovable Cloud / Supabase)
- **Auth**: Secure admin login with Supabase Auth
- **Content management**: Edit page text content via admin panel
- **Klantcases CRUD**: Add/edit/delete customer cases with title, description, image, category
- **Admin route** at `/admin` with protected access

### Database Tables
- `page_content` — editable text blocks per page (key, content, page)
- `klantcases` — customer cases (title, description, image_url, category, published, created_at)
- `user_roles` — admin role management with RLS

### Design System
- Primary: #0784b6, Secondary: #08abd8, Background: #ffffff
- Clean, professional typography (Inter/system fonts)
- Uploaded logo in header
- Responsive (mobile hamburger menu + desktop nav)
- Smooth page transitions, fast loading

### Technical
- React Router for all pages
- SEO-friendly: proper meta tags, semantic HTML, Dutch lang attribute
- Optimized images and lazy loading
- Scalable component architecture

