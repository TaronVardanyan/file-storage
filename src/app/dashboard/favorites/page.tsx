'use client';

import FilesBrowser from '../_components/files-browser';

export default function FavoritesPage() {
  return (
    <div>
      <FilesBrowser title="Your Favorites" isFavorites={true} />
    </div>
  );
}
