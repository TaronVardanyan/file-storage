'use client';

import FilesBrowser from '../_components/files-browser';

export default function TrashPage() {
  return (
    <div>
      <FilesBrowser title="Your Favorites" deleteOnly={true} />
    </div>
  );
}
