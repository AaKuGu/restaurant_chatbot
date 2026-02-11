(function () {
  if (window.TastyBitesChatbot) return;
  window.TastyBitesChatbot = true;

  const isMobile = window.innerWidth <= 640;

  console.log("Embedding Tasty Bites Chatbot - Mobile:", isMobile);

  const iframe = document.createElement("iframe");
  // iframe.src = "https://restaurant-chatbot-seven.vercel.app/chat";
  iframe.src =
    process.env.NEXT_PUBLIC_FRONTEND_ROUTE_CHAT || "http://localhost:3000/chat";
  iframe.style.position = "fixed";
  iframe.style.border = "none";
  iframe.style.borderRadius = isMobile ? "0px" : "12px";
  iframe.style.boxShadow = isMobile ? "none" : "0 10px 30px rgba(0,0,0,0.2)";
  iframe.style.zIndex = "999999";
  iframe.style.display = "none";

  if (isMobile) {
    // Mobile: centered full-screen
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
  } else {
    // Desktop: bottom-right
    iframe.style.bottom = "20px";
    iframe.style.right = "20px";
    iframe.style.width = "360px";
    iframe.style.height = "520px";
  }

  const button = document.createElement("button");
  button.innerText = "💬 Chat with Tasty Bites";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "12px 16px";
  button.style.borderRadius = "999px";
  button.style.border = "none";
  button.style.background = "#16a34a";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.zIndex = "999999";

  button.onclick = () => {
    iframe.style.display = "block";
    button.style.display = "none";
  };

  window.addEventListener("message", (event) => {
    if (event.data === "CLOSE_CHAT") {
      iframe.style.display = "none";
      button.style.display = "block";
    }
  });

  document.body.appendChild(iframe);
  document.body.appendChild(button);
})();
