// (function () {
//   // Prevent loading twice
//   if (window.TastyBitesChatbot) return;
//   window.TastyBitesChatbot = true;

//   // Create iframe
//   const iframe = document.createElement("iframe");

//   iframe.src = "https://restaurant-chatbot-seven.vercel.app/chat"; // your Next.js chatbot page
//   iframe.style.position = "fixed";
//   iframe.style.bottom = "20px";
//   iframe.style.right = "20px";
//   iframe.style.width = "360px";
//   iframe.style.height = "520px";
//   iframe.style.border = "none";
//   iframe.style.borderRadius = "12px";
//   iframe.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
//   iframe.style.zIndex = "999999";
//   iframe.style.display = "none";

//   // Floating button
//   const button = document.createElement("button");
//   button.innerText = "💬 Chat with Tasty Bites";
//   button.style.position = "fixed";
//   button.style.bottom = "20px";
//   button.style.right = "20px";
//   button.style.padding = "12px 16px";
//   button.style.borderRadius = "999px";
//   button.style.border = "none";
//   button.style.background = "#16a34a";
//   button.style.color = "white";
//   button.style.cursor = "pointer";
//   button.style.zIndex = "999999";

//   button.onclick = () => {
//     iframe.style.display = iframe.style.display === "none" ? "block" : "none";
//   };

//   document.body.appendChild(iframe);
//   document.body.appendChild(button);
// })();

(function () {
  if (window.TastyBitesChatbot) return;
  window.TastyBitesChatbot = true;

  const iframe = document.createElement("iframe");
  iframe.src = "https://yourdomain.com/chat";
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "360px";
  iframe.style.height = "520px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "12px";
  iframe.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
  iframe.style.zIndex = "999999";
  iframe.style.display = "none";

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

  // Open chat
  button.onclick = () => {
    iframe.style.display = "block";
    button.style.display = "none";
  };

  // Listen for close event from iframe
  window.addEventListener("message", (event) => {
    if (event.data === "CLOSE_CHAT") {
      iframe.style.display = "none";
      button.style.display = "block";
    }
  });

  document.body.appendChild(iframe);
  document.body.appendChild(button);
})();
