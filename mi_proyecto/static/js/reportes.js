(() => {
  "use strict";
  if (!window.Chart) return;

  const grid = "#4d91bd";
  const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const loansCanvas = document.getElementById("loansChart");
  if (loansCanvas) {
    new Chart(loansCanvas, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Préstamos",
          data: [64, 72, 81, 76, 93, 88, 102, 96, 112, 107, 128, null],
          borderColor: grid,
          backgroundColor: "rgba(77,145,189,.12)",
          fill: true,
          tension: .38,
          pointRadius: 3,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#96a2b0", font: { size: 9 } } },
          y: { beginAtZero: true, border: { display: false }, grid: { color: "#f0f3f6" }, ticks: { color: "#96a2b0", font: { size: 9 }, stepSize: 40 } },
        },
      },
    });
  }

  const popularCanvas = document.getElementById("popularBooksChart");
  if (popularCanvas) {
    new Chart(popularCanvas, {
      type: "doughnut",
      data: {
        labels: ["Cien años de soledad", "El principito", "El mundo de Sofía", "Otros"],
        datasets: [{ data: [32, 25, 21, 22], backgroundColor: ["#3279ad", "#71b5a0", "#e7b969", "#d9e3eb"], borderWidth: 0, hoverOffset: 4 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#77879a", usePointStyle: true, pointStyle: "circle", padding: 14, font: { size: 9 } } },
        },
      },
    });
  }
})();
