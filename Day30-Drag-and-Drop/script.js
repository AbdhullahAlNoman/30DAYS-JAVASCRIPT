// script.js
// Fully working drag & drop logic

document.addEventListener("DOMContentLoaded", () => {
  const palette = document.getElementById("palette");
  const dropzone = document.getElementById("dropzone");
  const droppedList = dropzone.querySelector(".dropped-list");

  let draggedItem = null;

  // Start dragging from source list
  palette.addEventListener("dragstart", e => {
    if (e.target.classList.contains("item")) {
      draggedItem = e.target;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", e.target.dataset.item);
    }
  });

  // Allow drop in dropzone
  dropzone.addEventListener("dragover", e => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  // Handle drop
  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.classList.remove("dragover");

    const name = e.dataTransfer.getData("text/plain");
    if (!name) return;

    const newItem = document.createElement("div");
    newItem.className = "dropped";
    newItem.textContent = draggedItem.textContent;
    newItem.draggable = true;

    droppedList.appendChild(newItem);
  });

  // Allow dragging back to palette to remove item
  palette.addEventListener("dragover", e => {
    e.preventDefault();
  });

  palette.addEventListener("drop", e => {
    e.preventDefault();
    if (draggedItem && draggedItem.classList.contains("dropped")) {
      draggedItem.remove();
    }
  });
});

