const COURSE_API_URL = "https://vvri.pythonanywhere.com/api/courses";
const STUDENT_API_URL = "https://vvri.pythonanywhere.com/api/students";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loadCourses").addEventListener("click", loadCourses);
    document.getElementById("loadStudents").addEventListener("click", loadStudents);
    document.getElementById("addCourse").addEventListener("click", () => addNew(COURSE_API_URL, loadCourses));
    document.getElementById("addStudent").addEventListener("click", () => addNew(STUDENT_API_URL, loadStudents));
});

function loadCourses() {
    fetchData(COURSE_API_URL, "course");
}

function loadStudents() {
    fetchData(STUDENT_API_URL, "student");
}

function fetchData(url, type) {
    fetch(url)
        .then(response => response.json())
        .then(data => displayData(data, type))
        .catch(error => console.error(`Hiba a ${type} betöltésekor:`, error));
}

function displayData(items, type) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    
    items.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `${item.name} <button onclick="editItem('${type}', ${item.id})">Szerkesztés</button> <button onclick="deleteItem('${type}', ${item.id})">Törlés</button>`;
        contentDiv.appendChild(div);
    });
}

function addNew(url, reloadFunction) {
    const name = prompt("Adj meg egy nevet:");
    if (name) {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        })
        .then(response => response.json())
        .then(() => reloadFunction())
        .catch(error => console.error("Hiba az új elem létrehozásakor:", error));
    }
}

function editItem(type, id) {
    const newName = prompt("Új név:");
    if (newName) {
        const API_URL = type === 'course' ? COURSE_API_URL : STUDENT_API_URL;
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName })
        })
        .then(() => type === 'course' ? loadCourses() : loadStudents())
        .catch(error => console.error("Hiba a szerkesztés során:", error));
    }
}

function deleteItem(type, id) {
    if (confirm("Biztosan törölni szeretnéd?")) {
        const API_URL = type === 'course' ? COURSE_API_URL : STUDENT_API_URL;
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => type === 'course' ? loadCourses() : loadStudents())
        .catch(error => console.error("Hiba a törlés során:", error));
    }
}
