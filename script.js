let allStudents = [];
let apiUrl = "https://dummyjson.com/users?limit=20";

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

async function fetchStudents(){
  document.getElementById("loader").style.display="block";
  try{
    let res = await fetch(apiUrl);
    let data = await res.json();
    allStudents = data.users.map(u=>({
      id: u.id,
      name: u.firstName+" "+u.lastName,
      email: u.email,
      age: u.age,
      course: u.company.department
    }));
    renderStudents(allStudents);
    document.getElementById("totalCount").innerText = allStudents.length;
    let totalAge = allStudents.reduce((a,b)=>a+b.age,0);
    document.getElementById("avgAge").innerText = Math.round(totalAge/allStudents.length);
    document.getElementById("loader").style.display="none";
  }catch(e){
    document.getElementById("loader").innerText = "API Error: "+e;
  }
}

function renderStudents(list){
  let tbody = document.getElementById("studentBody");
  tbody.innerHTML="";
  list.forEach(s=>{
    tbody.innerHTML+=`<tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td>${s.age}</td>
      <td>${s.course}</td>
      <td><button onclick="viewProfile(${s.id})">View</button> <button onclick="deleteStudent(${s.id})">Delete</button></td>
    </tr>`;
  });
}

function viewProfile(id){
  let s = allStudents.find(x=>x.id==id);
  if(!s) return;
  document.getElementById("profileCard").innerHTML=`
    <h2>${s.name}</h2>
    <p><b>ID:</b> ${s.id}</p>
    <p><b>Email:</b> ${s.email}</p>
    <p><b>Age:</b> ${s.age}</p>
    <p><b>Department:</b> ${s.course}</p>
  `;
  showSection('profile');
}

function deleteStudent(id){
  if(confirm("Delete this student?")){
    allStudents = allStudents.filter(x=>x.id!=id);
    renderStudents(allStudents);
    document.getElementById("totalCount").innerText = allStudents.length;
    alert("Deleted!");
  }
}

function searchStudents(){
  let q = document.getElementById("searchInput").value.toLowerCase();
  let filtered = allStudents.filter(s=> s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  renderStudents(filtered);
}

function openAddModal(){ document.getElementById("addModal").classList.remove("hidden"); }
function closeAddModal(){ document.getElementById("addModal").classList.add("hidden"); }

function addStudent(){
  let name = document.getElementById("newName").value;
  let email = document.getElementById("newEmail").value;
  let age = document.getElementById("newAge").value;
  let course = document.getElementById("newCourse").value;
  if(!name || !email){ alert("Name and Email required"); return; }
  let newS = {id: Date.now(), name, email, age, course: course||"General"};
  allStudents.unshift(newS);
  renderStudents(allStudents);
  document.getElementById("totalCount").innerText = allStudents.length;
  closeAddModal();
  document.getElementById("newName").value="";
  document.getElementById("newEmail").value="";
  document.getElementById("newAge").value="";
  document.getElementById("newCourse").value="";
  showSection('students');
}

window.onload = fetchStudents;
