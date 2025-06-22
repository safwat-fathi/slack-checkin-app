export interface User {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
}

export interface CheckInEntry {
	id: string;
	userId: string;
	userName: string;
	checkInTime: string;
	checkOutTime?: string;
	status: "checked-in" | "checked-out";
	notes?: string;
	date: string;
}

export interface SlackUser {
	id: string;
	team_id: string;
	name: string;
	real_name: string;
	profile: {
		image_24: string;
		image_32: string;
		image_48: string;
		image_72: string;
	};
}
