function showSection(sectionId) {
    let sections = document.querySelectorAll(".section");
    sections.forEach(function(section) {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}

function viewProfile() {
    showSection("profile");
}

function deleteStudent(button) {
    let answer = confirm("Delete this student?");
    if (answer) {
        button.parentElement.parentElement.remove();
        alert("Student deleted successfully!");
    }
}

function searchStudent() {
    let search = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#studentTable tr");
    rows.forEach(function(row) {
        let name = row.cells[1].innerText.toLowerCase();
        if (name.includes(search)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function addStudent(event) {
    event.preventDefault();
    alert("Student added successfully! ✅");
    event.target.reset();
    showSection("students");
}
