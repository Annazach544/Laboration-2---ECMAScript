let courses = [];

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await fetchCourses();
    renderTable(courses);
    addEventListeners();
}

async function fetchCourses() {
    try {
        const response = await fetch("https://webbutveckling.miun.se/files/ramschema.json");

        if (!response.ok) {
            throw new Error("Fel vid hämtning av JSON");
        }

        courses = await response.json();

    } catch (error) {
        console.error("Något gick fel:", error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById("courseTable");
    tableBody.innerHTML = "";

    data.forEach(course => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.coursename}</td>
            <td>${course.progression}</td>
        `;

        tableBody.appendChild(row);
    });
}
let currentSort = {
    column: "",
    ascending: true
};

function addEventListeners() {
    document.querySelectorAll("th").forEach(header => {
        header.addEventListener("click", () => {
            sortCourses(header.dataset.sort);
        });
    });
    document.getElementById("searchInput")
    .addEventListener("input", filterCourses);
}

function sortCourses(column) {

    if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = column;
        currentSort.ascending = true;
    }

    courses.sort((a, b) => {

        let valueA = a[column].toLowerCase();
        let valueB = b[column].toLowerCase();

        if (valueA < valueB) return currentSort.ascending ? -1 : 1;
        if (valueA > valueB) return currentSort.ascending ? 1 : -1;
        return 0;
    });

    renderTable(courses);
}
function filterCourses(event) {

    const searchValue = event.target.value.toLowerCase();

    const filtered = courses.filter(course =>
        course.code.toLowerCase().includes(searchValue) ||
        course.coursename.toLowerCase().includes(searchValue)
    );

    renderTable(filtered);
}
