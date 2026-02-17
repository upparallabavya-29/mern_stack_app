import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Start New Interview</h2>
                    <p className="text-gray-600 mb-4">Choose a role and simulate a real interview.</p>
                    <Link to="/interview/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Start Interview
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">History</h2>
                    <p className="text-gray-600">No interviews yet.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
