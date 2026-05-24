(function () {
  if (window.__furryDeckLoaderPromise) return;
  const baseUrl = new URL('../vendor-parts/deck-gl/', document.currentScript.src);
  window.__furryDeckLoaderPromise = fetch(new URL('manifest.json', baseUrl))
    .then(response => {
      if (!response.ok) throw new Error('Failed to load deck-gl manifest');
      return response.json();
    })
    .then(files => Promise.all(files.map(file => fetch(new URL(file, baseUrl)).then(response => {
      if (!response.ok) throw new Error('Failed to load deck-gl chunk ' + file);
      return response.text();
    }))))
    .then(parts => new Promise((resolve, reject) => {
      const blob = new Blob([parts.join('') + '\n//# sourceURL=deck-gl.bundle.js'], { type: 'text/javascript' });
      const script = document.createElement('script');
      script.src = URL.createObjectURL(blob);
      script.onload = () => { URL.revokeObjectURL(script.src); resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    }));
})();
