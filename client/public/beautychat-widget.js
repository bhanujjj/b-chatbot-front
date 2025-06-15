(function () {
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
})(); 