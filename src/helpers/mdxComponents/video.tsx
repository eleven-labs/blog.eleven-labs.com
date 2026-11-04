import React from 'react';

export interface VideoProps {
  src: string;
  title?: string;
  // The dimensions of the video, whose ratio reserves its height before it loads
  width?: number;
  height?: number;
  // The WebVTT captions of a video with speech
  captions?: string;
}

const VIDEO_TYPES: Record<string, string> = { mp4: 'video/mp4', ogv: 'video/ogg', webm: 'video/webm' };

// A video hosted by the blog, its type telling the browser whether it can play it before loading it
export const Video: React.FC<VideoProps> = ({ src, title, width, height, captions }) => (
  // The videos without speech, such as screen recordings, have no captions
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video
    className="mx-auto mb-3 w-full"
    title={title}
    style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    controls
    preload="metadata"
  >
    <source src={src} type={VIDEO_TYPES[src.split('?')[0].split('.').pop()?.toLowerCase() ?? '']} />
    {captions && <track kind="captions" src={captions} default />}
  </video>
);
