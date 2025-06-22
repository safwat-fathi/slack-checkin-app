import { useState, useEffect } from "react";
import type { CheckInEntry } from "../../types";
import { SlackAPI } from "../../utils/slack";

export const Dashboard = () => {
	const [entries, setEntries] = useState<CheckInEntry[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadEntries();
	}, []);

	const loadEntries = async () => {
		setLoading(true);
		const todayEntries = await SlackAPI.getTodayEntries();
		setEntries(todayEntries);
		setLoading(false);
	};

	const getStatusColor = (status: string) => {
		return status === "checked-in" ? "text-slack-green" : "text-gray-500";
	};

	const getStatusBadge = (status: string) => {
		return status === "checked-in"
			? "bg-slack-green text-white"
			: "bg-gray-300 text-gray-700";
	};

	const calculateWorkTime = (entry: CheckInEntry): string => {
		if (!entry.checkOutTime) return "In progress...";

		const checkIn = new Date(entry.checkInTime);
		const checkOut = new Date(entry.checkOutTime);
		const diff = checkOut.getTime() - checkIn.getTime();

		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		return `${hours}h ${minutes}m`;
	};

	if (!entries) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="animate-pulse">
					<div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
					<div className="space-y-3">
						<div className="h-4 bg-gray-200 rounded"></div>
						<div className="h-4 bg-gray-200 rounded w-5/6"></div>
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
					</div>
				</div>
			</div>
		);
	}
	
	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="animate-pulse">
					<div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
					<div className="space-y-3">
						<div className="h-4 bg-gray-200 rounded"></div>
						<div className="h-4 bg-gray-200 rounded w-5/6"></div>
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">
				Today's Activity ({new Date().toLocaleDateString()})
			</h3>

			{entries.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					<p>No check-ins recorded for today.</p>
				</div>
			) : (
				<div className="space-y-4">
					{entries.map(entry => (
						<div
							key={entry.id}
							className="border border-gray-200 rounded-lg p-4"
						>
							<div className="flex justify-between items-start mb-2">
								<div>
									<h4 className="font-medium text-gray-800">
										{entry.userName}
									</h4>
									<p className="text-sm text-gray-600">
										Check-in: {new Date(entry.checkInTime).toLocaleTimeString()}
									</p>
									{entry.checkOutTime && (
										<p className="text-sm text-gray-600">
											Check-out:{" "}
											{new Date(entry.checkOutTime).toLocaleTimeString()}
										</p>
									)}
								</div>
								<div className="text-right">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
											entry.status
										)}`}
									>
										{entry.status === "checked-in" ? "Active" : "Completed"}
									</span>
									<p className="text-sm text-gray-600 mt-1">
										{calculateWorkTime(entry)}
									</p>
								</div>
							</div>

							{entry.notes && (
								<div className="mt-3 p-3 bg-gray-50 rounded-md">
									<p className="text-sm text-gray-700">{entry.notes}</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
