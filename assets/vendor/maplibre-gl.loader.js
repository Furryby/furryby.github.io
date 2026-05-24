(function () {
  if (window.__furryMapLibreLoaderPromise) return;
  const baseUrl = new URL('../vendor-parts/maplibre-gl/', document.currentScript.src);
  window.__furryMapLibreLoaderPromise = fetch(new URL('manifest.json', baseUrl))
    .then(response => {
      if (!response.ok) throw new Error('Failed to load maplibre-gl manifest');
      return response.json();
    })
    .then(files => Promise.all(files.map(file => fetch(new URL(file, baseUrl)).then(response => {
      if (!response.ok) throw new Error('Failed to load maplibre-gl chunk ' + file);
      return response.text();
    }))))
    .then(parts => new Promise((resolve, reject) => {
      const blob = new Blob([parts.join('') + '\n//# sourceURL=maplibre-gl.bundle.js'], { type: 'text/javascript' });
      const script = document.createElement('script');
      script.src = URL.createObjectURL(blob);
      script.onload = () => { URL.revokeObjectURL(script.src); resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    }));
})();
