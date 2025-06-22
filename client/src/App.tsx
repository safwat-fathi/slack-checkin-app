import { useState } from "react";
import { CheckInForm } from "./components/CheckInForm";
import { Dashboard } from "./components/Dashboard";

const App = () => {
	const [userId] = useState("U1234567890"); // In real app, get from Slack auth
	const [refreshKey, setRefreshKey] = useState(0);

	const handleUpdate = () => {
		setRefreshKey(prev => prev + 1);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<header className="text-center mb-8">
					<h1 className="text-3xl font-bold text-slack-purple mb-2">
						Remote Check-In System
					</h1>
					<p className="text-gray-600">
						Track your remote work hours with ease
					</p>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div>
						<CheckInForm userId={userId} onUpdate={handleUpdate} />
					</div>

					{/* <div key={refreshKey}>
						<Dashboard />
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default App;
