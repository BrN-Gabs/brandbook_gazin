/** Pass the selected photo and its description when the imagery is defined. */
export function PurposePhotoFrame({ src, alt = '' }: { src?: string; alt?: string }) {
  return (
    <div className="purpose-photo-stage" aria-hidden={src ? undefined : true}>
      <div className="purpose-photo-frame">
        <div className="purpose-photo-window">
          {src && <img src={src} alt={alt} loading="lazy" decoding="async" />}
        </div>
      </div>
    </div>
  )
}
