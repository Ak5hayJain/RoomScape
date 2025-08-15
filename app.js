let btn = document.getElementById('colorBtn');
let wall = document.querySelector('.wall');
let room = document.querySelector('.room');

// ----------------------
// Wall Color Change
// ----------------------
btn.addEventListener("click", function() {
    let randomColor = getRandomColor();
    wall.style.backgroundColor = randomColor;
    console.log("Wall color changed to:", randomColor);
});

function getRandomColor() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
}

// ----------------------
// Drag from furniture area
// ----------------------
let draggedItemType = null;

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('dragstart', e => {
        draggedItemType = e.target.dataset.type;
    });
});

room.addEventListener('dragover', e => e.preventDefault());

room.addEventListener('drop', e => {
    e.preventDefault();
    if (draggedItemType) {
        addItemToRoom(draggedItemType, e.offsetX, e.offsetY);
        draggedItemType = null;
    }
});

// ----------------------
// Add furniture/person
// ----------------------
let selectedElement = null; // Track clicked element

function addItemToRoom(type, x, y) {
    let element = document.createElement('div');
    element.classList.add(type);
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    if (type === 'person') {
        element.textContent = "🧍";
        element.style.fontSize = "60px"; // bigger default size
    } else if (type === 'sofa') {
        element.style.width = "100px";
        element.style.height = "50px";
        element.style.backgroundColor = "#8b0000";
        element.style.borderRadius = "10px";
    } else if (type === 'lamp') {
        element.style.width = "20px";
        element.style.height = "80px";
        element.style.backgroundColor = "#444";
    }

    // Make movable, deletable, resizable
    makeMovable(element);
    makeDeletable(element);
    makeSelectable(element);

    room.appendChild(element);
}

// ----------------------
// Movable
// ----------------------
function makeMovable(el) {
    let offsetX, offsetY, isDragging = false;

    el.addEventListener('mousedown', e => {
        if (deleteMode) return;
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        el.style.cursor = "grabbing";
        setSelected(el); // also select while moving
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            let roomRect = room.getBoundingClientRect();
            let newX = e.clientX - roomRect.left - offsetX;
            let newY = e.clientY - roomRect.top - offsetY;

            newX = Math.max(0, Math.min(newX, room.clientWidth - el.offsetWidth));
            newY = Math.max(0, Math.min(newY, room.clientHeight - el.offsetHeight));

            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        el.style.cursor = "grab";
    });

    el.style.cursor = "grab";
}

// ----------------------
// Select & highlight
// ----------------------
function makeSelectable(el) {
    el.addEventListener('click', () => {
        if (!deleteMode) setSelected(el);
    });
}

function setSelected(el) {
    if (selectedElement) {
        selectedElement.style.outline = ""; // remove old highlight
    }
    selectedElement = el;
    selectedElement.style.outline = "3px dashed blue";
}

// ----------------------
// Delete Mode
// ----------------------
let deleteMode = false;
let deleteBtn = document.createElement("button");
deleteBtn.textContent = "🗑️ Eraser Mode";
deleteBtn.style.margin = "10px";
document.body.insertBefore(deleteBtn, room);

deleteBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    deleteBtn.style.backgroundColor = deleteMode ? "red" : "";
    if (deleteMode && selectedElement) {
        selectedElement.style.outline = ""; // clear selection
        selectedElement = null;
    }
});

function makeDeletable(el) {
    el.addEventListener("click", () => {
        if (deleteMode) {
            el.remove();
            selectedElement = null;
        }
    });
}

// ----------------------
// Resize (Arrow Up / Down)
// ----------------------
document.addEventListener("keydown", e => {
    if (!selectedElement) return;

    if (selectedElement.classList.contains("person")) {
        let size = parseInt(selectedElement.style.fontSize);
        if (e.key === "ArrowUp") selectedElement.style.fontSize = (size + 5) + "px";
        if (e.key === "ArrowDown") selectedElement.style.fontSize = Math.max(20, size - 5) + "px";
    } else {
        let w = selectedElement.offsetWidth;
        let h = selectedElement.offsetHeight;
        if (e.key === "ArrowUp") {
            selectedElement.style.width = (w + 10) + "px";
            selectedElement.style.height = (h + 10) + "px";
        }
        if (e.key === "ArrowDown") {
            selectedElement.style.width = Math.max(20, w - 10) + "px";
            selectedElement.style.height = Math.max(20, h - 10) + "px";
        }
    }
});
