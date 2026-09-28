let clients = JSON.parse(localStorage.getItem("fitnessClients")) || initialClients;

const searchName = document.getElementById("searchName");
const filterStatus = document.getElementById("filterStatus");
const btnAdd = document.getElementById("btnAdd");
const formSection = document.getElementById("formSection");
const listSection = document.getElementById("listSection");
const detailSection = document.getElementById("detailSection");
const formTitle = document.getElementById("formTitle");
const clientsTable = document.getElementById("clientsTable");
const clientDetails = document.getElementById("clientDetails");
const visitHistory = document.getElementById("visitHistory");

function save() {
  localStorage.setItem("fitnessClients", JSON.stringify(clients));
}

function renderList() {
  const nameQuery = searchName.value.trim().toLowerCase();
  const statusQuery = filterStatus.value;

  const filtered = clients.filter(c => {
    const matchName = c.fullName.toLowerCase().includes(nameQuery);
    const matchStatus = !statusQuery || c.membershipStatus === statusQuery;
    return matchName && matchStatus;
  });

  clientsTable.innerHTML = filtered.map(c => `
    <tr>
      <td>${c.cardNumber}</td>
      <td>${c.fullName}</td>
      <td>${c.phone}</td>
      <td>${c.membershipType}</td>
      <td>${c.membershipStatus}</td>
      <td>
        <button onclick="viewClient(${c.id})">Просмотр</button>
        <button onclick="editClient(${c.id})">Ред.</button>
        <button onclick="deleteClient(${c.id})">Удал.</button>
      </td>
    </tr>
  `).join("");
}

function showForm(client = null) {
  formSection.classList.remove("hidden");
  listSection.classList.add("hidden");
  detailSection.classList.add("hidden");

  formTitle.textContent = client ? "Редактирование клиента" : "Новый клиент";
  document.getElementById("clientId").value = client ? client.id : "";
  document.getElementById("cardNumber").value = client ? client.cardNumber : "";
  document.getElementById("fullName").value = client ? client.fullName : "";
  document.getElementById("phone").value = client ? client.phone : "";
  document.getElementById("email").value = client ? client.email : "";
  document.getElementById("birthDate").value = client ? client.birthDate : "";
  document.getElementById("registrationDate").value = client ? client.registrationDate : "";
  document.getElementById("membershipType").value = client ? client.membershipType : "Месячный";
  document.getElementById("membershipStatus").value = client ? client.membershipStatus : "Активен";
  document.getElementById("membershipEnd").value = client ? client.membershipEnd : "";
}

function hideForm() {
  formSection.classList.add("hidden");
  listSection.classList.remove("hidden");
  detailSection.classList.add("hidden");
}

function saveClient() {
  const id = document.getElementById("clientId").value;
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const registrationDate = document.getElementById("registrationDate").value;

  if (!cardNumber || !fullName || !phone || !registrationDate) {
    alert("Заполните обязательные поля: номер карты, ФИО, телефон, дата регистрации.");
    return;
  }

  const clientData = {
    cardNumber,
    fullName,
    phone,
    email: document.getElementById("email").value.trim(),
    birthDate: document.getElementById("birthDate").value,
    registrationDate,
    membershipType: document.getElementById("membershipType").value,
    membershipStatus: document.getElementById("membershipStatus").value,
    membershipEnd: document.getElementById("membershipEnd").value
  };

  if (id) {
    const client = clients.find(c => c.id === Number(id));
    Object.assign(client, clientData);
  } else {
    const newId = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    clients.push({ id: newId, ...clientData, visits: [] });
  }

  save();
  hideForm();
  renderList();
}

function editClient(id) {
  const client = clients.find(c => c.id === id);
  if (client) showForm(client);
}

function deleteClient(id) {
  if (!confirm("Удалить клиента?")) return;
  clients = clients.filter(c => c.id !== id);
  save();
  renderList();
}

function viewClient(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;

  listSection.classList.add("hidden");
  formSection.classList.add("hidden");
  detailSection.classList.remove("hidden");

  clientDetails.innerHTML = `
    <p><b>Карта:</b> ${client.cardNumber}</p>
    <p><b>ФИО:</b> ${client.fullName}</p>
    <p><b>Телефон:</b> ${client.phone}</p>
    <p><b>Email:</b> ${client.email || "—"}</p>
    <p><b>Дата рождения:</b> ${client.birthDate || "—"}</p>
    <p><b>Дата регистрации:</b> ${client.registrationDate}</p>
    <p><b>Абонемент:</b> ${client.membershipType}, до ${client.membershipEnd || "—"}</p>
    <p><b>Статус:</b> ${client.membershipStatus}</p>
  `;

  visitHistory.innerHTML = client.visits && client.visits.length
    ? `<table>
        <thead><tr><th>Дата</th><th>Тренировка</th><th>Калории</th><th>Статус</th></tr></thead>
        <tbody>
          ${client.visits.map(v => `
            <tr>
              <td>${v.date}</td>
              <td>${v.training}</td>
              <td>${v.calories}</td>
              <td>${v.status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`
    : "<p>История посещений пуста.</p>";
}

btnAdd.addEventListener("click", () => showForm());
document.getElementById("btnSave").addEventListener("click", saveClient);
document.getElementById("btnCancel").addEventListener("click", hideForm);
document.getElementById("btnBack").addEventListener("click", () => {
  detailSection.classList.add("hidden");
  listSection.classList.remove("hidden");
});
searchName.addEventListener("input", renderList);
filterStatus.addEventListener("change", renderList);

renderList();