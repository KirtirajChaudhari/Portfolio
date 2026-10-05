import { useEffect, useState } from 'react';
import { chapterTwoMeta as meta, creatorIntro as intro } from '../content/novel';
import { Link } from 'react-router-dom';
import PhotographyWall from '../components/chapter-two/PhotographyWall';
import MusicSection from '../components/chapter-two/MusicSection';
import PoetryNotebook from '../components/chapter-two/PoetryNotebook';
import './CreatorPage.css';

export default function CreatorPage() {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    document.title = 'Beyond the Code — Kirtiraj Nitin Chaudhari';
    const id = requestAnimationFrame(() => setVis(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="creator">
      <div className="container">
        <header className={`creator__head${vis ? ' is-in' : ''}`}>
          <div className="creator__meta mono-xs">
            <span>{meta.kicker}</span>
            <span>/ TABLA · LENS · INK</span>
          </div>

          <h1 className="creator__title">
            <span>Beyond</span><br />
            <span className="creator__title-accent">the Code</span>
          </h1>

          <p className="creator__hey hand">Hey —</p>
          {/* Spec v2 copy, verbatim. */}
          <p className="creator__intro">{intro}</p>
          <p className="creator__epigraph">{meta.epigraph}</p>

          <div className="creator__switch">
            <Link to="/" className="mono-xs">Back to the engineering profile</Link>
          </div>
        </header>
      </div>

      <PhotographyWall vis={vis} />
      <MusicSection vis={vis} />
      <PoetryNotebook vis={vis} />
    </div>
  );
}
