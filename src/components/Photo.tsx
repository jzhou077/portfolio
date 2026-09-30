import type { Photo as PhotoData } from "../content";

/** Shows the photo, or an empty frame labelled with what belongs there. */
export function Photo({ photo, className = "" }: { photo: PhotoData; className?: string }) {
  return (
    <figure className={`photo ${className}`}>
      {photo.src ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" />
      ) : (
        <div className="photo-empty" role="img" aria-label={`${photo.alt} (not added yet)`}>
          {photo.alt}
        </div>
      )}
    </figure>
  );
}
