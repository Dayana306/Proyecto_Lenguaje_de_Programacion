(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let pendingDelete = null;
  let editingRow = null;

  function showToast(message, type = "success") {
    let container = $("#toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      container.setAttribute("aria-live", "polite");
      document.body.append(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast align-items-center";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<div class="toast-body"><i class="bi ${type === "error" ? "bi-exclamation-circle" : "bi-check-circle"}"></i><span></span><button type="button" class="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
    $(".toast-body span", toast).textContent = message;
    container.append(toast);
    if (window.bootstrap?.Toast) {
      const instance = new bootstrap.Toast(toast, { delay: 3300 });
      toast.addEventListener("hidden.bs.toast", () => toast.remove(), { once: true });
      instance.show();
    } else {
      toast.classList.add("show");
      window.setTimeout(() => toast.remove(), 3300);
    }
  }

  function modalInstance(element) {
    return window.bootstrap?.Modal && element ? bootstrap.Modal.getOrCreateInstance(element) : null;
  }

  function refreshTable(table) {
    if (!table) return;
    const tableId = table.id;
    const rows = $$("[data-table-row]", table);
    const query = ($(`[data-table-search="${tableId}"]`)?.value || "").trim().toLocaleLowerCase();
    const filters = $$(`[data-table-filter="${tableId}"]`);
    const pageSize = 5;
    const matching = rows.filter(row => {
      const matchesText = !query || row.textContent.toLocaleLowerCase().includes(query);
      const matchesFilters = filters.every(filter => {
        const selected = filter.value.trim().toLocaleLowerCase();
        if (!selected) return true;
        const value = (row.dataset[filter.dataset.filterField] || "").toLocaleLowerCase();
        return value === selected;
      });
      return matchesText && matchesFilters;
    });
    const currentPage = Math.max(1, Number(table.dataset.currentPage || 1));
    const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
    const page = Math.min(currentPage, pageCount);
    table.dataset.currentPage = String(page);
    rows.forEach(row => {
      row.hidden = !matching.includes(row) || matching.indexOf(row) < (page - 1) * pageSize || matching.indexOf(row) >= page * pageSize;
    });
    const tableShell = table.closest(".admin-table-card") || table.parentElement?.parentElement;
    const summary = $("[data-table-summary]", tableShell);
    if (summary) {
      const start = matching.length ? (page - 1) * pageSize + 1 : 0;
      const end = Math.min(page * pageSize, matching.length);
      summary.textContent = `Mostrando ${start}–${end} de ${matching.length} registros`;
    }
    const pagination = $(`[data-pagination="${tableId}"]`, tableShell);
    if (pagination) {
      pagination.replaceChildren();
      const makePage = (label, target, disabled, active = false) => {
        const item = document.createElement("li");
        item.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;
        const link = document.createElement("button");
        link.className = "page-link";
        link.type = "button";
        link.textContent = label;
        link.disabled = disabled;
        link.addEventListener("click", () => {
          table.dataset.currentPage = String(target);
          refreshTable(table);
        });
        item.append(link);
        pagination.append(item);
      };
      makePage("‹", page - 1, page === 1);
      for (let number = 1; number <= pageCount; number += 1) makePage(String(number), number, false, page === number);
      makePage("›", page + 1, page === pageCount);
    }
  }

  function refreshCatalog(root = document) {
    const grid = $("[data-catalog-grid]", root);
    if (!grid) return;
    const query = ($("[data-catalog-search]", root)?.value || "").trim().toLocaleLowerCase();
    const filters = $$("[data-catalog-filter]", root);
    let visibleCount = 0;
    $$("[data-catalog-card]", grid).forEach(card => {
      const textMatch = !query || `${card.dataset.title} ${card.dataset.author} ${card.textContent}`.toLocaleLowerCase().includes(query);
      const filterMatch = filters.every(filter => {
        const value = filter.value.trim().toLocaleLowerCase();
        return !value || (card.dataset[filter.dataset.catalogFilter] || "").toLocaleLowerCase() === value;
      });
      card.hidden = !textMatch || !filterMatch;
      if (!card.hidden) visibleCount += 1;
    });
    const empty = $("[data-catalog-empty]", grid);
    if (empty) empty.hidden = visibleCount > 0;
  }

  function addTableRecord(form) {
    const fields = Object.fromEntries(new FormData(form).entries());
    if (form.closest("#bookFormModal")) {
      const table = $("#books-table");
      if (!table) return;
      const title = document.createElement("strong");
      title.textContent = fields.title || "Nuevo libro";
      const author = document.createElement("small");
      author.textContent = fields.author || "";
      let row = editingRow;
      if (row) {
        $("strong", row).textContent = title.textContent;
        $("small", row).textContent = author.textContent;
        row.dataset.category = fields.category || "";
        row.cells[1].textContent = fields.category || "—";
        row.cells[2].textContent = fields.year || "—";
        row.cells[3].textContent = fields.format || "PDF";
        $(".license-count", row).textContent = fields.licenses || "1";
        editingRow = null;
      } else {
        row = document.createElement("tr");
        row.dataset.tableRow = "";
        row.dataset.category = fields.category || "";
        const cover = document.createElement("span");
        cover.className = "mini-cover cover-indigo";
        const bookCell = document.createElement("td");
        const book = document.createElement("span");
        book.className = "table-book";
        const copy = document.createElement("span");
        copy.append(title, author);
        book.append(cover, copy);
        bookCell.append(book);
        const values = [fields.category || "—", fields.year || "—", fields.format || "PDF", fields.licenses || "1"];
        row.append(bookCell);
        values.forEach((value, index) => {
          const cell = document.createElement("td");
          if (index === 3) {
            const badge = document.createElement("span");
            badge.className = "license-count";
            badge.textContent = value;
            cell.append(badge);
          } else cell.textContent = value;
          row.append(cell);
        });
        const status = document.createElement("td");
        status.innerHTML = '<span class="status-badge status-approved">Disponible</span>';
        const actions = document.createElement("td");
        actions.className = "text-end";
        actions.innerHTML = '<div class="table-actions"><button class="action-icon" type="button" data-edit-row aria-label="Editar"><i class="bi bi-pencil"></i></button><button class="action-icon delete-action" type="button" data-delete-row aria-label="Eliminar"><i class="bi bi-trash3"></i></button></div>';
        row.append(status, actions);
        table.tBodies[0].prepend(row);
        table.dataset.currentPage = "1";
      }
      refreshTable(table);
    } else if (form.closest("#userFormModal")) {
      const table = $("#users-table");
      if (!table) return;
      if (editingRow) {
        const cells = editingRow.cells;
        const strong = $("strong", cells[0]);
        const email = $("small", cells[0]);
        if (strong) strong.textContent = fields.name || "Usuario";
        if (email) email.textContent = fields.email || "";
        cells[1].textContent = fields.code || "";
        cells[2].textContent = fields.role || "Estudiante";
        editingRow.dataset.role = fields.role || "Estudiante";
        editingRow.dataset.status ||= "Activo";
        editingRow = null;
      } else {
        const row = document.createElement("tr");
        row.dataset.tableRow = "";
        row.dataset.role = fields.role || "Estudiante";
        row.dataset.status = "Activo";
        row.innerHTML = `<td><div class="person-cell"><span class="avatar soft-avatar"></span><span><strong></strong><small></small></span></div></td><td></td><td><span class="role-badge"></span></td><td><span class="status-badge status-approved">Activo</span></td><td>Hoy</td><td class="text-end"><div class="table-actions"><button class="action-icon" type="button" data-toggle-user aria-label="Cambiar estado"><i class="bi bi-person-slash"></i></button><button class="action-icon delete-action" type="button" data-delete-row aria-label="Eliminar"><i class="bi bi-trash3"></i></button></div></td>`;
        $(".soft-avatar", row).textContent = (fields.name || "U").slice(0, 1);
        $("strong", row).textContent = fields.name || "Usuario";
        $("small", row).textContent = fields.email || "";
        row.cells[1].textContent = fields.code || "";
        $(".role-badge", row).textContent = fields.role || "Estudiante";
        table.tBodies[0].prepend(row);
        table.dataset.currentPage = "1";
        refreshTable(table);
      }
    }
  }

  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest("[data-sidebar-toggle]")) {
      $("#app-sidebar")?.classList.add("is-open");
      $(".sidebar-backdrop")?.classList.add("is-visible");
    }
    if (target.closest("[data-sidebar-close]")) {
      $("#app-sidebar")?.classList.remove("is-open");
      $(".sidebar-backdrop")?.classList.remove("is-visible");
    }
    if (target.closest('[data-bs-target="#bookFormModal"], [data-bs-target="#userFormModal"]')) {
      editingRow = null;
      const modal = $(target.closest("[data-bs-target]").dataset.bsTarget);
      const title = $(".modal-title", modal);
      if (title) title.textContent = modal.id === "userFormModal" ? "Registrar usuario" : "Registrar libro";
      $("form", modal)?.reset();
    }
    const toastTrigger = target.closest("[data-toast]");
    if (toastTrigger) showToast(toastTrigger.dataset.toast);

    const detailTrigger = target.closest("[data-book-details]");
    if (detailTrigger) {
      $$("[data-detail]").forEach(node => {
        node.textContent = detailTrigger.dataset[node.dataset.detail] || "No especificado";
      });
      modalInstance($("#bookDetailsModal"))?.show();
    }

    const loanTrigger = target.closest("[data-loan-request]");
    if (loanTrigger) {
      loanTrigger.disabled = true;
      loanTrigger.innerHTML = 'Solicitado <i class="bi bi-check2"></i>';
      loanTrigger.classList.remove("btn-primary");
      loanTrigger.classList.add("btn-outline-primary");
      showToast(`Solicitud de “${loanTrigger.dataset.loanRequest}” registrada en esta demostración.`);
    }

    const loanAction = target.closest("[data-loan-action]");
    if (loanAction) {
      const row = loanAction.closest("tr");
      const status = loanAction.dataset.loanAction;
      row.dataset.status = status;
      const badge = $(".status-badge", row);
      badge.className = `status-badge status-${status.toLocaleLowerCase()}`;
      badge.textContent = status;
      $$("[data-loan-action]", row).forEach(button => button.remove());
      const count = $('[data-count-status="Pendiente"]');
      if (count) count.textContent = String(Math.max(0, Number(count.textContent) - 1));
      showToast(`Solicitud ${status.toLocaleLowerCase()} correctamente.`);
      refreshTable($("#loans-table"));
    }

    const details = target.closest("[data-loan-details]");
    if (details) {
      $$("[data-loan-detail]").forEach(node => {
        node.textContent = details.dataset[node.dataset.loanDetail] || "—";
      });
      modalInstance($("#loanDetailsModal"))?.show();
    }

    const deleteButton = target.closest("[data-delete-row]");
    if (deleteButton) {
      pendingDelete = deleteButton.closest("tr");
      modalInstance($("#confirmModal"))?.show();
    }

    if (target.closest("[data-confirm-delete]") && pendingDelete) {
      const table = pendingDelete.closest("table");
      pendingDelete.remove();
      pendingDelete = null;
      modalInstance($("#confirmModal"))?.hide();
      refreshTable(table);
      showToast("Registro eliminado de la vista de demostración.");
    }

    const toggleUser = target.closest("[data-toggle-user]");
    if (toggleUser) {
      const row = toggleUser.closest("tr");
      const active = row.dataset.status !== "Suspendido";
      row.dataset.status = active ? "Suspendido" : "Activo";
      const badge = $(".status-badge", row);
      badge.className = `status-badge ${active ? "status-rejected" : "status-approved"}`;
      badge.textContent = row.dataset.status;
      toggleUser.innerHTML = active ? '<i class="bi bi-person-check"></i>' : '<i class="bi bi-person-slash"></i>';
      showToast(active ? "Cuenta suspendida." : "Cuenta activada.");
      refreshTable($("#users-table"));
    }

    const bookView = target.closest("[data-book-view]");
    if (bookView) {
      $("[data-book-preview-title]").textContent = bookView.dataset.bookView;
      $("[data-book-preview-author]").textContent = bookView.dataset.bookAuthor || "";
      modalInstance($("#bookPreviewModal"))?.show();
    }

    const edit = target.closest("[data-edit-row], [data-edit-user]");
    if (edit) {
      const row = edit.closest("tr");
      editingRow = row;
      const modal = edit.hasAttribute("data-edit-user") ? $("#userFormModal") : $("#bookFormModal");
      const form = $("form", modal);
      if (form && row) {
        const title = $(".modal-title", modal);
        if (title) title.textContent = edit.hasAttribute("data-edit-user") ? "Editar usuario" : "Editar libro";
        if (edit.hasAttribute("data-edit-user")) {
          form.elements.name.value = edit.dataset.editUser;
          form.elements.email.value = edit.dataset.userEmail;
          form.elements.code.value = edit.dataset.userCode;
          form.elements.role.value = edit.dataset.userRole;
        } else {
          form.elements.title.value = $("strong", row)?.textContent || "";
          form.elements.author.value = $("small", row)?.textContent || "";
          form.elements.category.value = row.dataset.category || "";
          form.elements.year.value = row.cells[2]?.textContent.trim() || "";
          form.elements.format.value = row.cells[3]?.textContent.trim() || "PDF";
          form.elements.licenses.value = $(".license-count", row)?.textContent || 1;
        }
        modalInstance(modal)?.show();
      }
    }

    const download = target.closest("[data-download-demo]");
    if (download) {
      const filename = `${download.dataset.downloadDemo.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
      const content = `BiblioSmart · Material educativo de demostración\n${download.dataset.downloadDemo}\n\nArchivo de muestra.`;
      downloadBlob(content, filename, "text/plain;charset=utf-8");
      showToast("Se descargó un archivo de demostración.");
    }

    if (target.closest("[data-reader-prev]")) changeReaderPage(-1);
    if (target.closest("[data-reader-next]")) changeReaderPage(1);
    if (target.closest("[data-zoom-in]")) changeZoom(10);
    if (target.closest("[data-zoom-out]")) changeZoom(-10);
    if (target.closest("[data-reader-fullscreen]")) {
      const stage = $("[data-reader-stage]");
      if (document.fullscreenElement) document.exitFullscreen();
      else stage?.requestFullscreen?.();
    }

    const exportButton = target.closest("[data-export]");
    if (exportButton) exportData(exportButton);
    if (target.closest("[data-apply-report-filters]")) showToast("Filtros aplicados a los datos de demostración.");
  });

  document.addEventListener("input", event => {
    const target = event.target;
    if (target.matches("[data-table-search]")) {
      const table = $(`#${CSS.escape(target.dataset.tableSearch)}`);
      if (table) {
        table.dataset.currentPage = "1";
        refreshTable(table);
      }
    }
    if (target.matches("[data-catalog-search]")) refreshCatalog(target.closest("main"));
    if (target.matches("[data-global-search]")) {
      const query = target.value.trim().toLocaleLowerCase();
      const table = $(".data-table[id]");
      if (table) {
        const specific = $(`[data-table-search="${table.id}"]`);
        if (specific) {
          specific.value = target.value;
          refreshTable(table);
        }
      }
      const catalogSearch = $("[data-catalog-search]");
      if (catalogSearch) {
        catalogSearch.value = target.value;
        refreshCatalog();
      } else if (!table && query) {
        showToast("No hay resultados para buscar en esta página.", "error");
      }
    }
  });

  document.addEventListener("change", event => {
    const target = event.target;
    if (target.matches("[data-table-filter]")) {
      const table = $(`#${CSS.escape(target.dataset.tableFilter)}`);
      if (table) {
        table.dataset.currentPage = "1";
        refreshTable(table);
      }
    }
    if (target.matches("[data-catalog-filter]")) refreshCatalog(target.closest("main"));
    if (target.matches("[data-image-preview-input]")) {
      const file = target.files?.[0];
      const preview = $("[data-image-preview]");
      if (!file || !preview) return;
      if (!file.type.startsWith("image/")) {
        showToast("Selecciona un archivo de imagen válido.", "error");
        target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        preview.src = String(reader.result);
        preview.hidden = false;
      });
      reader.readAsDataURL(file);
    }
    if (target.matches("[data-document-name]")) {
      const output = $("[data-file-name]");
      if (output) output.textContent = target.files?.[0]?.name || "PDF o ePub. Archivo local de demostración; no se almacena.";
    }
  });

  document.addEventListener("submit", event => {
    const form = event.target;
    if (form.matches("[data-demo-form]")) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      addTableRecord(form);
      const modal = form.closest(".modal");
      modalInstance(modal)?.hide();
      form.reset();
      const preview = $("[data-image-preview]");
      if (preview) {
        preview.src = "";
        preview.hidden = true;
      }
      const title = $(".modal-title", modal);
      if (title) title.textContent = modal.id === "userFormModal" ? "Registrar usuario" : modal.id === "bookFormModal" ? "Registrar libro" : title.textContent;
      showToast("Cambios guardados en la vista de demostración.");
    }
  });

  function changeReaderPage(direction) {
    const current = $("[data-current-page]");
    if (!current) return;
    const total = Number($("[data-total-pages]")?.textContent || 24);
    const page = Math.min(total, Math.max(1, Number(current.textContent) + direction));
    current.textContent = String(page);
    $("[data-page-number]").textContent = String(page);
    const progress = Math.round(page / total * 100);
    $("[data-progress-text]").textContent = `${progress}%`;
    $("[data-progress-bar]").style.width = `${progress}%`;
    const title = $("[data-reader-title]");
    const copy = $("[data-reader-copy]");
    if (title && copy && page > 1) {
      title.textContent = page < 8 ? "Un dibujo sorprendente" : "El viaje continúa";
      copy.textContent = page < 8
        ? "Enseñé mi obra maestra a las personas mayores y les pregunté si mi dibujo les daba miedo."
        : "Y así, página a página, el pequeño viajero descubrió nuevas formas de mirar el mundo.";
    } else if (title && copy) {
      title.textContent = "El principito";
      copy.textContent = "Cuando yo tenía seis años vi en un libro sobre la selva virgen que se titulaba “Historias vividas”, una magnífica lámina. Representaba una serpiente boa que se tragaba a una fiera.";
    }
  }

  let zoom = 100;
  function changeZoom(delta) {
    zoom = Math.min(150, Math.max(70, zoom + delta));
    $("[data-zoom-label]").textContent = `${zoom}%`;
    $("[data-reader-page]").style.transform = `scale(${zoom / 100})`;
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  function exportData(button) {
    if (button.dataset.export === "pdf") {
      const table = $(".report-bottom table");
      if (!table) {
        showToast("No se encontró información para exportar.", "error");
        return;
      }
      const rows = $$("tr", table).map(row =>
        $$("th,td", row).map(cell => cell.textContent.trim()).join("  |  ")
      );
      downloadBlob(createDemoPdf(["BiblioSmart - Reporte de actividad", "Resumen de prestamos · 2026", "", ...rows]), "bibliosmart-reporte.pdf", "application/pdf");
      showToast("Reporte PDF de demostración descargado.");
      return;
    }
    const table = button.dataset.exportTable ? $(`#${CSS.escape(button.dataset.exportTable)}`) : $(".report-bottom table");
    if (!table) {
      showToast("No se encontró información para exportar.", "error");
      return;
    }
    const lines = $$("tr", table).filter(row => !row.hidden).map(row =>
      $$("th,td", row).map(cell => `"${cell.textContent.trim().replaceAll('"', '""')}"`).join(",")
    );
    downloadBlob(`\ufeff${lines.join("\r\n")}`, "bibliosmart-reporte.csv", "text/csv;charset=utf-8");
    showToast("Reporte descargado en formato compatible con Excel.");
  }

  function createDemoPdf(lines) {
    const clean = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, " ").replace(/[\\()]/g, "\\$&");
    const commands = ["BT", "/F1 15 Tf", "50 750 Td"];
    lines.slice(0, 30).forEach((line, index) => {
      if (index > 0) commands.push("0 -22 Td");
      commands.push(`/F1 ${index === 0 ? 15 : 9} Tf`);
      commands.push(`(${clean(line).slice(0, 105)}) Tj`);
    });
    commands.push("ET");
    const stream = commands.join("\n");
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return pdf;
  }

  $$("table[id]").forEach(refreshTable);
  refreshCatalog();
})();
