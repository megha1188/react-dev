interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
    jobTitle: string;
}

let data: User[] = [];
let sortedData: User[] = [];
let sortKey: keyof User = 'id';
let sortAsc = true;

const tableBody = document.querySelector<HTMLTableSectionElement>('#data-table tbody')!;
const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;
const tableHeaders = document.querySelectorAll<HTMLTableCellElement>('#data-table th');

async function fetchData() {
    try {
        const response = await fetch('http://localhost:3002/api/users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        sortedData = [...data];
        renderTable(sortedData);
    } catch (error) {
        console.error("Failed to fetch data:", error);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Failed to load data. Is the API server running?</td></tr>`;
    }
}

function renderTable(dataToRender: User[]) {
    const rows = dataToRender.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.city}</td>
            <td>${user.country}</td>
            <td>${user.jobTitle}</td>
        </tr>
    `);
    tableBody.innerHTML = rows.join('');
}

fetchData();

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = sortedData.filter(user =>
        Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm)
        )
    );
    renderTable(filteredData);
});

tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const newSortKey = header.dataset.sortKey as keyof User;
        if (sortKey === newSortKey) {
            sortAsc = !sortAsc;
        } else {
            sortKey = newSortKey;
            sortAsc = true;
        }
        sortData();
        renderTable(sortedData);
    });
});

function sortData() {
    sortedData.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) {
            return sortAsc ? -1 : 1;
        }
        if (valA > valB) {
            return sortAsc ? 1 : -1;
        }
        return 0;
    });
}
