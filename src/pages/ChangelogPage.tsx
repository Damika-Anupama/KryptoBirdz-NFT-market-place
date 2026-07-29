import { useEffect } from "react";
import { CHANGELOG } from "../data/changelog";
import { REPO_URL } from "../data/links";

export default function ChangelogPage() {
  useEffect(() => {
    document.title = "Changelog — KryptoBirdz";
  }, []);

  return (
    <main className="docpage">
      <h1 className="section-title">Changelog</h1>
      <p className="section-sub">
        Shipped in verified waves — each wave is built, tested, deployed, and
        live-checked. The full catalog lives in{" "}
        <a
          href={`${REPO_URL}/blob/frontend-only/FEATURES.md`}
          target="_blank"
          rel="noreferrer"
        >
          FEATURES.md
        </a>
        .
      </p>
      <ol className="waves">
        {CHANGELOG.map((w) => (
          <li key={w.wave} className="wave">
            <div className="wave__head">
              <span className="wave__num">Wave {w.wave}</span>
              <span className="wave__title">{w.title}</span>
              <span className="wave__date">{w.date}</span>
            </div>
            <ul className="wave__list">
              {w.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </main>
  );
}
