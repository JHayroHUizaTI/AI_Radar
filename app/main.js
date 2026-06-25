const cards = document.querySelector("#cards");
const count = document.querySelector("#item-count");
const headline = document.querySelector("#headline");
const summary = document.querySelector("#summary");
const primaryLink = document.querySelector("#primary-link");
const filters = [...document.querySelectorAll(".filter")];

let items = [];
let activeTopic = "all";

function matchesTopic(item) {
  return activeTopic === "all" || item.status === activeTopic;
}

function renderHero(list) {
  const top = list[0];
  if (!top) {
    headline.textContent = "No hay senales para este filtro";
    summary.textContent = "Prueba otro tema o agrega mas snapshots durante el curso.";
    primaryLink.href = "#";
    return;
  }

  headline.textContent = top.title;
  summary.textContent = top.impact;
  primaryLink.href = top.url;
}

function renderCards() {
  const visible = items.filter(matchesTopic);
  count.textContent = String(visible.length);
  renderHero(visible);

  cards.innerHTML = visible
    .map(
      (item) => `
        <article class="card">
          <div class="meta">
            <span class="pill">${item.source}</span>
            <span class="pill">${item.status}</span>
            <span class="score">${item.dedupe_key}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.evidence}</p>
          <p><strong>Impacto:</strong> ${item.impact}</p>
          <p><strong>Accion:</strong> ${item.action}</p>
          <a class="action" href="${item.url}" target="_blank" rel="noreferrer">Ver fuente</a>
        </article>
      `
    )
    .join("");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeTopic = button.dataset.topic;
    renderCards();
  });
});

const response = await fetch("/api/signals");
items = await response.json();
renderCards();
