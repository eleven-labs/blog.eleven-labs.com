import React from 'react';

export interface YouTubeProps {
  id: string;
  title: string;
}

/**
 * A YouTube video, on the width of the post: its 16/9 ratio reserves its height before it loads, and the
 * `youtube-nocookie.com` domain sets no cookie until the video is played.
 */
export const YouTube: React.FC<YouTubeProps> = ({ id, title }) => (
  <div className="mb-3 aspect-video w-full">
    <iframe
      className="size-full"
      src={`https://www.youtube-nocookie.com/embed/${id}`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </div>
);
