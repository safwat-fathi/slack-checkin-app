import { useState, useEffect } from "react";
import type { SlackUser, CheckInEntry } from "../../types";
import { SlackAPI } from "../../utils/slack";

interface CheckInFormProps {
	userId: string;
	onUpdate: () => void;
}

export const CheckInForm = ({
	userId,
	onUpdate,
}: CheckInFormProps) => {
	const [user, setUser] = useState<SlackUser | null>(null);
	const [currentStatus, setCurrentStatus] = useState<CheckInEntry | null>(null);
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadUserData();
	}, [userId]);

	const loadUserData = async () => {
		const [userInfo, status] = await Promise.all([
			SlackAPI.getUserInfo(userId),
			SlackAPI.getUserStatus(userId),
		]);
		setUser(userInfo);
		setCurrentStatus(status);
	};

	const handleCheckIn = async () => {
		setLoading(true);
		const result = await SlackAPI.checkIn(userId, notes);
		if (result) {
			setCurrentStatus(result);
			setNotes("");
			onUpdate();
		}
		setLoading(false);
	};

	const handleCheckOut = async () => {
		setLoading(true);
		const result = await SlackAPI.checkOut(userId, notes);
		if (result) {
			setCurrentStatus(result);
			setNotes("");
			onUpdate();
		}
		setLoading(false);
	};

	const isCheckedIn = currentStatus?.status === "checked-in";

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6">
			<div className="flex items-center mb-4">
				{user?.profile?.image_48 && (
					<img
						src={user.profile.image_48}
						alt={user.real_name}
						className="w-12 h-12 rounded-full mr-4"
					/>
				)}
				<div>
					<h2 className="text-xl font-semibold text-gray-800">
						{user?.real_name || "Loading..."}
					</h2>
					<p className="text-sm text-gray-600">
						Status:{" "}
						{isCheckedIn ? (
							<span className="text-slack-green font-medium">Checked In</span>
						) : (
							<span className="text-gray-500 font-medium">Checked Out</span>
						)}
					</p>
				</div>
			</div>

			{currentStatus && (
				<div className="bg-gray-50 rounded-lg p-4 mb-4">
					<div className="flex justify-between items-center">
						<div>
							<p className="text-sm text-gray-600">
								Check-in:{" "}
								{new Date(currentStatus.checkInTime).toLocaleTimeString()}
							</p>
							{currentStatus.checkOutTime && (
								<p className="text-sm text-gray-600">
									Check-out:{" "}
									{new Date(currentStatus.checkOutTime).toLocaleTimeString()}
								</p>
							)}
						</div>
						<div
							className={`px-3 py-1 rounded-full text-xs font-medium ${
								isCheckedIn
									? "bg-slack-green text-white"
									: "bg-gray-300 text-gray-700"
							}`}
						>
							{isCheckedIn ? "Active" : "Completed"}
						</div>
					</div>
				</div>
			)}

			<div className="mb-4">
				<label
					htmlFor="notes"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Notes (optional)
				</label>
				<textarea
					id="notes"
					value={notes}
					onChange={e => setNotes(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slack-purple focus:border-transparent"
					rows={3}
					placeholder="Add any notes about your work session..."
				/>
			</div>

			<div className="flex gap-3">
				{!isCheckedIn ? (
					<button
						onClick={handleCheckIn}
						disabled={loading}
						className="flex-1 bg-slack-green text-white py-3 px-4 rounded-md font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? "Checking In..." : "Check In"}
					</button>
				) : (
					<button
						onClick={handleCheckOut}
						disabled={loading}
						className="flex-1 bg-slack-red text-white py-3 px-4 rounded-md font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? "Checking Out..." : "Check Out"}
					</button>
				)}
			</div>
		</div>
	);
};
