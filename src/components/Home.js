import { useState, useEffect } from 'react';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('http://localhost:3001/api/tasks');
                
                if (!response.ok) {
                    // Handle different HTTP error codes
                    if (response.status === 404) {
                        setTasks([]);
                        throw new Error('No tasks found');
                    }
                    if (response.status === 500) {
                        throw new Error('Server error');
                    }
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
                
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []); // Empty dependency array means this runs once when component mounts

    return (
        <div className="home">
            <h2>Tasks</h2>
            {loading && <div>Loading tasks...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && (
                <div className="tasks-list">
                    {tasks.length === 0 ? (
                        <p>No tasks found. Create a new task!</p>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="task-card">
                                <h3>{task.task}</h3>
                                <p className="task-date">{task.task_date}</p>
                                <p className="task-description">{task.task_description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Home;