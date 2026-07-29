import { Link } from "react-router-dom";
import { useEffect } from "react";
import { BIRDZ } from "../data/birdz";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Lost bird — KryptoBirdz";
  }, []);
  // A deterministic "lost bird" to illustrate the page.
  const lost = BIRDZ[5];
  return (
    <div className="notfound">
      <img src={lost.image} alt="" className="notfound__bird" aria-hidden="true" />
      <h1>404 — this bird has flown</h1>
      <p>
        The page you're looking for isn't in the aviary. Maybe it migrated, or
        maybe the link moulted.
      </p>
      <div className="notfound__actions">
        <Link className="btn btn--primary" to="/market">
          Back to the marketplace
        </Link>
        <Link className="btn btn--ghost" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}
