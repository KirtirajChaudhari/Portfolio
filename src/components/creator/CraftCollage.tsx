import { musicSection as music, poetryMeta } from '../../content/novel';
import { photographs } from '../../content/photographs';
import Vinyl from './Vinyl';

/** The image beside "Beyond the code": the three crafts as three objects on a desk.
 *  A polaroid from the photo selection, the debut single's sleeve with its record,
 *  and a notebook page carrying the owner's own line about the writing. Every piece
 *  is real material. This is the slot for the owner's own illustration later:
 *  swap this component when it arrives. */
export default function CraftCollage() {
  const photo = photographs.find((p) => p.height === p.width) ?? photographs[1];
  return (
    <div className="collage" role="group" aria-label="Photography, music and writing">
      <a href="#photos" className="polaroid">
        <figure>
          <span className="tape" aria-hidden="true" />
          <img src={photo.thumb ?? photo.src} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" />
          <figcaption>Photography</figcaption>
        </figure>
      </a>
      <a href="#music" className="sleeve">
        <figure>
          <span className="vinyl" aria-hidden="true"><Vinyl /></span>
          <img className="cover" src={music.debutCover} alt={`Cover of the debut single, ${music.debutTitle}`} width={300} height={300} decoding="async" />
          <figcaption>Music</figcaption>
        </figure>
      </a>
      <a href="#poetry" className="notebook">
        <figure>
          <p>{poetryMeta.blurb}</p>
          <figcaption className="!text-left">Writing</figcaption>
        </figure>
      </a>
    </div>
  );
}
