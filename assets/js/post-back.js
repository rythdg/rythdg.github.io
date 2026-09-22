(function () {
  const link = document.getElementById("post-back");
  if (!link) return;

  const from = new URLSearchParams(window.location.search).get("from");

  if (from === "research") {
    link.href = link.dataset.researchUrl;
    link.textContent = "← Back to Research";
  } else {
    link.href = link.dataset.blogUrl;
    link.textContent = "← Back to Blog";
  }
})();
