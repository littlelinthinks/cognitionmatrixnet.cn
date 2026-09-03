import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LangContext";

export default function Footer() {
  const { t } = useLang();

  const quickLinks = [
    { to: "/", label: t.nav.home },
    { to: "/tools", label: t.nav.tools },
    { to: "/business-brain", label: t.nav.businessBrain },
    { to: "/insights", label: t.nav.insights },
    { to: "/assessment", label: t.nav.assessment },
  ];

  const productLinks = [
    { to: "/enterprise", label: t.nav.enterprise },
    { to: "/agent", label: t.nav.agent },
    { to: "/vip", label: t.nav.vip },
  ];

  return (
    <footer className="border-t border-cyber-border bg-cyber-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-green">
            <span className="text-xs font-black text-cyber-bg">C</span>
          </div>
          <span className="text-lg font-bold tracking-wider text-ink-primary">
            认知矩阵网络
          </span>
            </Link>
            <p className="text-caption leading-relaxed text-ink-secondary">
              {t.footer.desc}
            </p>
            <p className="mt-3 text-xs text-ink-footer">
              cognitionmatrixnet.cn
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-caption font-semibold text-ink-primary">
              {t.footer.quickNav}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-caption text-ink-secondary transition-colors hover:text-neon-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-caption font-semibold text-ink-primary">
              {t.footer.products}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-caption text-ink-secondary transition-colors hover:text-neon-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-caption font-semibold text-ink-primary">
              {t.footer.contact}
            </h4>
            <p className="text-caption text-ink-secondary">
              contact@cognitionmatrixnet.cn
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-cyber-border pt-6">
          <p className="text-center text-xs leading-relaxed text-ink-footer">
            {t.footer.disclaimer}
          </p>
          <p className="mt-3 text-center text-xs text-ink-footer">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
