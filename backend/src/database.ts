
import { IUser } from "./Interfaces/IUser";

export default class Database {

	users: IUser[] = [
		{
			userId:1,
			username:"Pablo",
			password:"Pablo",
		}
	];
	// porque ya esta pablo
	newUserId: number = 1;


	createUser(user: IUser): number {
		if (this.users.find(elem => elem.username === user.username))
			return 0;
		this.newUserId++;
		user.userId = this.newUserId;
		this.users.push(user);
		return this.newUserId;
	};

	validateUser(user: IUser): IUser {
		const userResponse: IUser = this.users.find(elem => elem.username === user.username);
		if (!userResponse)
			return null;
		if (userResponse.password === user.password)
			return this.userView(userResponse);
		return null
	};

	updateUser(userId: number, user: IUser) {
		this.users.forEach(elem => {
			if (elem.userId === userId) {
				elem.username = user.username;
				elem.password = user.password;
			}
		});
	};

	getUsers(): IUser[] {
		const users: IUser[] = [];
		this.users.forEach(elem => {
			const user: IUser = this.userView(elem);
			users.push(user)
		})
		return this.users;
	};

	getUserById(id: number): IUser {
		let user: IUser = this.users.find(elem => elem.userId === id);
		user = this.userView(user);
		return user;
	};

	getUsernameById(id: number): string {
		const user: IUser = this.users.find(elem => elem.userId === id);
		return user.username;
	};

	getPasswordById(id: number): string {
		const user: IUser = this.users.find(elem => elem.userId === id);
		return user.password;
	};

	getUserCredentials(userId: number): IUser {
		const user: IUser = this.users.find(elem => elem.userId === userId);
		const userResponse: IUser = {};
		userResponse.username = user.username;
		userResponse.password = user.password;
		return userResponse;
	}

	getUserId(user: IUser): number {
		return this.users.find(elem => elem.username === user.username).userId;
	};

	getUserByUsername(username: string): IUser {
		let user: IUser = this.users.find(elem => elem.username === username);
		user = this.userView(user);
		return user;
	};

	userView(user: IUser): IUser {
		const userResponse: IUser = user;
		userResponse.password = "";
		userResponse.token = "";
		return userResponse;
	};
}
