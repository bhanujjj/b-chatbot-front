(function () {
  // Load dependencies in sequence
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load dependencies in sequence
  loadScript('https://unpkg.com/react@18/umd/react.production.min.js')
    .then(() => loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'))
    .then(() => loadScript('https://unpkg.com/styled-components@6/dist/styled-components.min.js'))
    .then(() => loadScript('https://b-chatbot-frontendd.vercel.app/beautychat-widget.js'))
    .then(() => {
      // Initialize the widget
      if (window.BeautyChatWidget && typeof window.BeautyChatWidget.init === 'function') {
        window.BeautyChatWidget.init();
      } else {
        console.error('Beauty Chat Widget failed to load properly');
      }
    })
    .catch((error) => {
      console.error('Error loading Beauty Chat Widget:', error);
    });
})(); 