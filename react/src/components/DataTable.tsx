import React, { useState, useEffect, useMemo } from 'react';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
    jobTitle: string;
}

const DataTable: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<keyof User>('id');
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Optionally, set an error state and display a message to the user
            }
        };
        fetchData();
    }, []);

    const sortedData = useMemo(() => {
        const sorted = [...data].sort((a, b) => {
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
        return sorted;
    }, [data, sortKey, sortAsc]);

    const filteredData = useMemo(() => {
        return sortedData.filter(user =>
            Object.values(user).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [sortedData, searchTerm]);

    const handleSort = (key: keyof User) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    return (
        <div id="app">
            <div className="controls">
                <input
                    type="search"
                    id="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <table id="data-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>ID</th>
                        <th onClick={() => handleSort('firstName')}>First Name</th>
                        <th onClick={() => handleSort('lastName')}>Last Name</th>
                        <th onClick={() => handleSort('email')}>Email</th>
                        <th onClick={() => handleSort('city')}>City</th>
                        <th onClick={() => handleSort('country')}>Country</th>
                        <th onClick={() => handleSort('jobTitle')}>Job Title</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                            <td>{user.country}</td>
                            <td>{user.jobTitle}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
