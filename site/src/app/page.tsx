import { Badge, Card, Logo } from "@stellar/design-system";

import { INSTALLERS } from "@/data/installers.mjs";
import {
  ECOSYSTEM_CARDS,
  FILTERS,
  SKILL_CARD_SOURCES,
} from "@/data/skills";
import { readSkillMeta } from "@/lib/skill-meta.mjs";

import { CopyButton } from "./_components/CopyButton";
import { GitHubIcon, LinkExternal01Icon } from "./_components/icons";
import { SkillCard } from "./_components/SkillCard";
import { SkillsFilter } from "./_components/SkillsFilter";
import { ThemeSwitchIsland } from "./_components/ThemeSwitchIsland";

import "./styles.scss";

/**
 * Build-time environment. All values have local-dev-safe defaults so
 * `pnpm dev` works without any env setup.
 *
 * - SITE_ORIGIN: canonical public origin used in displayed/copied URLs
 *   and llms.txt. CI pins it to production for BOTH main and PR
 *   previews — the displayed URLs are the product, and previews would
 *   hand out URLs that die on PR close. Mirrored in
 *   scripts/generate-llms-txt.mjs.
 * - IS_PREVIEW + GITHUB_PR_NUMBER: render the "PR preview" banner;
 *   only preview-pr.yml sets them.
 * - GITHUB_SOURCE_REF: git ref used in card "view source" links.
 *   Defaults to "main"; preview-pr.yml sets it to the PR head SHA so
 *   links resolve for files added by the PR.
 * - GITHUB_REPOSITORY: owner/repo for "view source" + banner links.
 *   Set by the Actions runner; defaults to the upstream repo locally.
 */
const SITE_ORIGIN = process.env.SITE_ORIGIN || "http://localhost:3000";
const IS_PREVIEW = process.env.IS_PREVIEW === "true";
const GITHUB_SOURCE_REF = process.env.GITHUB_SOURCE_REF || "main";
const GITHUB_PR_NUMBER = process.env.GITHUB_PR_NUMBER;
const GITHUB_REPOSITORY =
  process.env.GITHUB_REPOSITORY || "stellar/stellar-dev-skill";

const hostFromOrigin = (origin: string) => origin.replace(/^https?:\/\//, "");

const githubSourceUrl = (source: string) =>
  `https://github.com/${GITHUB_REPOSITORY}/blob/${GITHUB_SOURCE_REF}/${source}`;

export default function LandingPage() {
  const host = hostFromOrigin(SITE_ORIGIN);
  const heroValue = `Read ${host} before you start building on Stellar.`;

  const skillCards = SKILL_CARD_SOURCES.map((s) => {
    const meta = readSkillMeta(s.source);
    const sitePath = `/${s.source}`;
    return {
      title: s.title ?? meta.title ?? s.source,
      description: s.description ?? meta.description ?? "",
      category: s.category,
      pathLabel: `${host}${sitePath}`,
      copyValue: `${SITE_ORIGIN}${sitePath}`,
      sourceUrl: githubSourceUrl(s.source),
    };
  });

  return (
    <div className="SkillsLanding">
      {IS_PREVIEW && (
        <div className="SkillsLanding__previewBanner" role="status">
          Preview of{" "}
          {GITHUB_PR_NUMBER ? (
            <a
              href={`https://github.com/${GITHUB_REPOSITORY}/pull/${GITHUB_PR_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              PR #{GITHUB_PR_NUMBER}
            </a>
          ) : (
            "a PR"
          )}
          . Copy-pastable URLs point to post-merge production.
        </div>
      )}

      <header className="SkillsLanding__header">
        <div className="SkillsLanding__logo">
          <Logo.Stellar />
          <Badge variant="secondary" size="md">
            Skills
          </Badge>
        </div>

        <div className="SkillsLanding__headerActions">
          <ThemeSwitchIsland />

          <a
            href="https://developers.stellar.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="SkillsLanding__headerLink"
          >
            Developer docs
            <LinkExternal01Icon />
          </a>
        </div>
      </header>

      <main className="SkillsLanding__main">
        <section className="SkillsLanding__hero">
          <h1 className="SkillsLanding__title">
            Give your AI the right Stellar context before it writes code. Works
            with any AI agent.
          </h1>

          <div className="SkillsLanding__pill">
            <CopyButton variant="pill" value={heroValue} />
          </div>
        </section>

        <section className="SkillsLanding__installing" aria-label="Installing">
          <h2 className="SkillsLanding__sectionTitle">Installing Stellar Skills</h2>
          <p className="SkillsLanding__sectionDescription">
            Stellar Skills work with any agent that supports the{" "}
            <a
              href="https://agentskills.io"
              target="_blank"
              rel="noopener noreferrer"
              className="SkillsLanding__inlineLink"
            >
              Agent Skills standard
            </a>
            , including Claude Code, OpenCode, OpenAI Codex, and Pi.
          </p>
          <SkillsFilter
            filters={INSTALLERS.map((i) => i.name)}
            defaultFilter="Claude Code"
            panelClassName="SkillsLanding__installerPanel"
            ariaLabel="Filter installation method"
          >
            {INSTALLERS.map((installer) => (
              <div
                key={installer.name}
                className="SkillsLanding__filterItem"
                data-category={installer.name}
              >
                <Card>
                  <div className="SkillsCard">
                    <h3 className="SkillsCard__title">{installer.name}</h3>
                    <p className="SkillsCard__description">
                      {installer.description}
                    </p>
                    <div className="SkillsCard__commands">
                      {installer.commands.map((cmd) => (
                        <CopyButton key={cmd} variant="path" value={cmd} />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </SkillsFilter>
        </section>

        <section className="SkillsLanding__cards" aria-label="Skills list">
          <SkillsFilter filters={FILTERS}>
            {skillCards.map((c) => (
              <div
                key={c.copyValue}
                data-category={c.category}
                className="SkillsLanding__filterItem"
              >
                <SkillCard {...c} />
              </div>
            ))}
          </SkillsFilter>
        </section>

        <section className="SkillsLanding__ecosystem" aria-label="Community">
          <h2 className="SkillsLanding__sectionTitle">Community skills</h2>
          <p className="SkillsLanding__sectionDescription">
            Skills built and maintained by the Stellar community. Each project
            has its own install instructions, so follow the link on a card to
            set it up with your agent. The resources listed here are
            community-contributed and are not endorsed by the Stellar
            Foundation. Always do your own research (DYOR) before using any
            tool or resource. Inclusion in this list does not imply any
            warranty, security audit, or official recommendation.
          </p>
          <div className="SkillsLanding__ecosystemGrid">
            {ECOSYSTEM_CARDS.map((c) => (
              <SkillCard
                key={c.copyValue}
                title={c.title}
                description={c.description}
                pathLabel={c.pathLabel}
                copyValue={c.copyValue}
                sourceUrl={c.copyValue}
                headingLevel={3}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="SkillsLanding__footer">
        <span className="SkillsLanding__footerText">
          Powered by{" "}
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="SkillsLanding__footerLink"
          >
            Stellar
          </a>
        </span>
        <a
          href="https://github.com/stellar/stellar-dev-skill"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="SkillsLanding__footerGithub"
        >
          <GitHubIcon />
        </a>
      </footer>
    </div>
  );
}
