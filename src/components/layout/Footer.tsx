import { Link } from "react-router-dom";
import SocialIcons from "@/components/SocialIcons";
import { useFooterConfig, FooterItem, FooterConfig } from "@/hooks/useFooterConfig";
import logoLg from "@/assets/lg-logo-wit.png.asset.json";

const isExternal = (url: string) => /^https?:\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");

const renderItem = (item: FooterItem, idx: number, linkStyle?: React.CSSProperties) => {
  if (item.type === "text") {
    return <li key={idx}>{item.text}</li>;
  }
  if (item.type === "button") {
    const inner = (
      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-aqua px-4 py-2 text-white font-semibold text-xs shadow-soft hover:opacity-90 transition-opacity">
        {item.label}
      </span>
    );
    return (
      <li key={idx} className="pt-3">
        {isExternal(item.url) ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer">{inner}</a>
        ) : (
          <Link to={item.url}>{inner}</Link>
        )}
      </li>
    );
  }
  // link
  return (
    <li key={idx}>
      {isExternal(item.url) ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" style={linkStyle}>{item.label}</a>
      ) : (
        <Link to={item.url} className="hover:text-primary transition-colors" style={linkStyle}>{item.label}</Link>
      )}
    </li>
  );
};

const Footer = ({ configOverride }: { configOverride?: FooterConfig } = {}) => {
  const { config: fetched } = useFooterConfig();
  const config = configOverride ?? fetched;
  const cols = config.columns?.length || 0;
  const gridColsClass = cols >= 4 ? "md:grid-cols-5" : cols === 3 ? "md:grid-cols-4" : cols === 2 ? "md:grid-cols-3" : cols === 1 ? "md:grid-cols-2" : "md:grid-cols-1";
  const copyright = (config.copyright || "").replace("{year}", String(new Date().getFullYear()));
  const hasBg = !!config.bgColor;
  const hasText = !!config.textColor;
  const hasLink = !!config.linkColor;
  const style: React.CSSProperties = {};
  if (hasBg) style.backgroundColor = config.bgColor;
  if (hasText) style.color = config.textColor;
  const linkStyle: React.CSSProperties | undefined = hasLink ? { color: config.linkColor } : undefined;
  const hasTitle = !!config.titleColor;
  const titleStyle: React.CSSProperties | undefined = hasTitle ? { color: config.titleColor } : undefined;

  return (
    <footer
      className={`relative ${hasBg ? "" : "bg-surface"} ${hasText ? "" : "text-muted-foreground"} mt-auto border-t border-border`}
      style={style}
    >
      <div className={`container relative py-16 grid grid-cols-1 ${gridColsClass} gap-10`}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-gradient-aqua grid place-items-center font-display font-bold text-white">L</div>
            <span className="font-display font-bold text-foreground text-lg">Loyalty<span className="text-primary">group</span></span>
          </div>
          <p className="text-sm leading-relaxed">{config.brandText}</p>
          {config.showSocials && <SocialIcons className="mt-5" />}
        </div>
        {config.columns.map((col, i) => (
          <div key={i}>
            <h4
              className={`${hasTitle ? "" : "text-foreground"} font-display font-semibold mb-4 text-xs tracking-[0.18em] uppercase`}
              style={titleStyle}
            >
              {col.title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {(col.items || []).map((it, idx) => renderItem(it, idx, linkStyle))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-border">
        <div className="container py-5 flex items-center justify-between text-xs text-muted-foreground/80">
          <span>{copyright}</span>
          <Link to="/admin/login" className="hover:text-primary transition-colors">
            Log in als administrator
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
