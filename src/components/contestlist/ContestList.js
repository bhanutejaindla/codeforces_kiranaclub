import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContestList.css';
import { Pagination } from '@shopify/polaris';
import {
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from 'recharts';
import { BarChart } from 'recharts';
import { useNavigate } from 'react-router-dom';
import CF from '../../utils/cf1.png';
import ICPC from '../../utils/icpc1.png';

const ContestList = () => {
    const [contests, setContests] = useState([]);
    const [viewContests, setViewContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [favorites, setFavorites] = useState([]); // State to store favorite contests
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterPhase, setFilterPhase] = useState('');
    const [filterFavorites, setFilterFavorites] = useState(false); // Filter for favorites
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const navigate = useNavigate();

    // Debounce function to delay the filter process
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch contest data from Codeforces API based on page and perPage
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('https://codeforces.com/api/contest.list', {});
                setContests(response.data.result)
            } catch (error) {
                console.error('Error fetching contest data:', error);
            }
        };
        fetchContests();
    }, []); // Fetch on page and perPage change


    // Dynamic filtering based on search term and type
    const filterContests = () => {
        if (!contests || contests.length === 0) return; // Safeguard against undefined or empty contests
        let filtered = contests.filter((contest) => {
            const matchesSearch = contest.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType ? contest.type === filterType : true;
            return matchesSearch && matchesType;
        });
        if (filterFavorites) {
            filtered = filtered.filter((contest) => favorites.includes(contest.id));
        }

        setFilteredContests(filtered);
    };

    useEffect(() => {
        filterContests();
    }, [searchTerm, filterType, favorites, contests, filterFavorites]); // Re-filter whenever search term, filter type, filter favorites, favorites, or contests change

    // Handle search input change with debounce
    const handleSearchChange = debounce((e) => {
        setSearchTerm(e.target.value);
    }, 500); // Wait 500ms after the user stops typing

    // Handle filter type change
    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    // Handle toggle favorite
    const toggleFavorite = (contestId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(contestId)
                ? prevFavorites.filter((id) => id !== contestId)
                : [...prevFavorites, contestId]
        );
    };
    // Get the current contests for the current page
    const indexOfLastContest = page * perPage;
    const indexOfFirstContest = indexOfLastContest - perPage;
    const currentContests = filteredContests.slice(indexOfFirstContest, indexOfLastContest);
    const totalPages = Math.ceil(filteredContests.length / perPage);

    const handleContestClick = (contestId) => {
        navigate(`/contest/${contestId}`); // Navigate to the contest details page
    };
    return (
        <div className="contest-list">
            {/* Filter and Search */}
            <div className="navbar-container">
                <div className="navbar-menu">
                    <button style={{ backgroundColor: !filterFavorites ? '#3498db' : '#34495e' }} onClick={() => {
                        setFilterFavorites(false);
                        setPage(1);
                    }}>Contest</button>
                    <button style={{ backgroundColor: filterFavorites ? '#3498db' : '#34495e' }} onClick={() => {
                        setFilterFavorites(true);
                        setPage(1);
                    }}>Favorite</button>
                </div>
                <div className="navbar-search">
                    <input
                        type="text"
                        onChange={handleSearchChange}
                        placeholder="Search"
                        className="search-input"
                    />
                    <select onChange={handleFilterChange} value={filterType}>
                        <option value="">All Types</option>
                        <option value="CF">CF</option>
                        <option value="ICPC">ICPC</option>
                    </select>
                </div>
                {/* <label>
          <input
            type="checkbox"
            checked={filterFavorites}
            onChange={() => setFilterFavorites(!filterFavorites)} // Toggle favorites filter
          />
          Show Favorites
        </label> */}
            </div>
            <div className='pagination_pages'>
                <span >
                    Page {page} of {totalPages}
                </span>
                <select onChange={(e) => {
                    setPerPage(parseInt(e.target.value, 10))
                    setPage(1);
                }} value={perPage}>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
            </div>
            <ul className="contest-list-items">
                {currentContests.map((contest) => (
                    <li
                        key={contest.id}
                        className="contest-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleContestClick(contest.id)}
                    >
                        <div>
                            {contest.type === 'CF' ? (
                                <img src={CF} alt="CF contest" width="60" height="60" />
                            ) : (
                                <img src={ICPC} alt="ICPC contest" width="60" height="60" />
                            )}
                        </div>
                        <div>
                            <strong>{contest.name}</strong>
                            <br />
                            <div style={{ fontWeight: 400 }}>{contest.type}</div>
                            <div
                                className={
                                    contest.phase === 'FINISHED'
                                        ? 'phase-finished'
                                        : contest.phase === 'BEFORE'
                                            ? 'phase-before'
                                            : contest.phase === 'CODING'
                                                ? 'phase-coding'
                                                : ''
                                }
                            >
                                {contest.phase}
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation on button click
                                toggleFavorite(contest.id);
                            }}
                            style={{
                                background: favorites.includes(contest.id) ? 'gold' : 'lightgray',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            {favorites.includes(contest.id) ? 'Unfavorite' : 'Favorite'}
                        </button>
                    </li>
                ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    type="table"
                    hasPrevious={page > 1}
                    onPrevious={() => {
                        setPage((prev) => Math.min(prev - 1, 1));
                    }}
                    hasNext={page < totalPages}
                    onNext={() => {
                        setPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                />
            </div>

            {/* Graph Section */}
            <div className="graph-container" style={{ marginTop: '20px' }}>
                <h3>Contest Duration vs. Name</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={currentContests}>
                        <XAxis dataKey="name" hide />
                        <YAxis domain={[0, 5000]} tickCount={20} interval="preserveStartEnd" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="durationSeconds" fill="#8884d8" />
                        <LabelList dataKey="name" position="bottom" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Contest List */}
        </div>
    );
};

export default ContestList;

