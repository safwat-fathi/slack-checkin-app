import type { CheckInEntry, SlackUser } from "../types";


const API_BASE_URL = "http://localhost:8000";

export class SlackAPI {
	static async getUserInfo(userId: string): Promise<SlackUser | null> {
		try {
			const response = await fetch(`${API_BASE_URL}/user/${userId}`);
			return await response.json();
		} catch (error) {
			console.error("Error fetching user info:", error);
			return null;
		}
	}

	static async checkIn(
		userId: string,
		notes?: string
	): Promise<CheckInEntry | null> {
		try {
			const response = await fetch(`${API_BASE_URL}/checkin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, notes }),
			});
			return await response.json();
		} catch (error) {
			console.error("Error checking in:", error);
			return null;
		}
	}

	static async checkOut(
		userId: string,
		notes?: string
	): Promise<CheckInEntry | null> {
		try {
			const response = await fetch(`${API_BASE_URL}/checkout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, notes }),
			});
			return await response.json();
		} catch (error) {
			console.error("Error checking out:", error);
			return null;
		}
	}

	static async getTodayEntries(): Promise<CheckInEntry[]> {
		try {
			const response = await fetch(`${API_BASE_URL}/entries/today`);
			return await response.json();
		} catch (error) {
			console.error("Error fetching entries:", error);
			return [];
		}
	}

	static async getUserStatus(userId: string): Promise<CheckInEntry | null> {
		try {
			const response = await fetch(`${API_BASE_URL}/status/${userId}`);
			return await response.json();
		} catch (error) {
			console.error("Error fetching user status:", error);
			return null;
		}
	}
}
