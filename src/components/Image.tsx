import React, { useState, useEffect } from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc,
      priority = false,
      className = '',
      loading,
      onError,
      ...props
    },
    ref
  ) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Synchronize to src changes (such as slideshow changes)
    useEffect(() => {
      setCurrentSrc(src);
      setHasError(false);
    }, [src]);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!hasError && fallbackSrc) {
        setHasError(true);
        setCurrentSrc(fallbackSrc);
      }
      if (onError) {
        onError(e);
      }
    };

    return (
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : (loading || 'lazy')}
        decoding="async"
        className={className}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
