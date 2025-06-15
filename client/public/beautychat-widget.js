(function () {
  // Load React and ReactDOM first
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  Promise.all([
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js')
  ]).then(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://b-chatbot-frontendd.vercel.app/widget";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "380px";
    iframe.style.height = "520px";
    iframe.style.border = "none";
    iframe.style.zIndex = "9999";
    iframe.style.borderRadius = "16px";
    iframe.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)";
    iframe.allow = "microphone; camera";
    document.body.appendChild(iframe);
  }).catch(console.error);
})(); 