import { NextFunction, Request, Response } from 'express';
import Database from '../database';
const database = new Database();
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import fs from "fs";
import { IResponse } from '../Interfaces/IResponse';
import { IUser } from '../Interfaces/IUser';

const RSA_PRIVATE_KEY = fs.readFileSync('private.key');

const createUser = async (req: Request, res: Response) => {

	const username = req.body.username;
	const password = req.body.password;

	const user: IUser = {
		username,
		password
	}

	const response: IResponse<IUser> = {
		stsCode: "",
		stsMsg: "",
		data: {}
	}

	if (username && password) {
		try {
			const result: number = database.createUser(user);
			if (result === 0) {
				response.stsCode = "409";
				response.stsMsg = "Username already exists";
				res.status(200).json(response);
			}
			else {
				response.stsCode = "200";
				response.stsMsg = "OK";
				response.data.userId = result;
				response.data.username = user.username;
				res.status(200).json(response);
			}
		}
		catch (err) {
			response.stsCode = "500";
			response.stsMsg = "Internal Server Error";
		}
	}
	else {
		response.stsCode = "404";
		response.stsMsg = "User Not Found";
		res.status(404).json(response);
	}
};

const validateUser = async (req: Request, res: Response) => {
	const username = req.body.username;
	const password = req.body.password;

	const user: IUser = {
		username,
		password
	}

	const response:IResponse<IUser> = {
		stsCode: "",
		stsMsg: "",
		data: {}
	}

	if (username && password) {
		try {
			const result: IUser = database.validateUser(user);
			if (!result) {
				response.stsCode = "404";
				response.stsMsg = "User Not Found";
				res.status(200).json(response);
			}
			else {
				response.stsCode = "200";
				response.stsMsg = "OK";
				response.data.userId = result.userId;
				response.data.username = result.username

				const idUser: string = result.userId.toString();
				const token = generateJWT(idUser);
				response.data.token = token;

				res.cookie("SESSIONID", jwt, { httpOnly: true, secure: true });

				res.status(200).json(response);
			}

		}
		catch (err) {
			res.status(500).json({ error: err?.message });
		}
	}
	else {
		response.stsCode = "404";
		response.stsMsg = "User Not Found";
		res.status(404).json(response);
	}
};


const generateJWT = (userId: string) => {
	const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
		algorithm: 'RS256',
		expiresIn: 2000,
		subject: userId
	})
	return jwtBearerToken;
}

const updateUser = async (req: Request, res: Response) => {
	try {
		const userId = req.body.userId;
		const password = req.body.password;
		const username = req.body.username;

		if (userId) {
			const data: IUser = {};
			if (password) {
				data.password = password;
			}
			if (username) {
				data.username = username;
			}
			database.updateUser(userId, data);
			res.send('User updated successfully');
		}
		else {
			res.status(400).send('Invalid user ID');
		}
	}
	catch (error) {
		res.status(500).send('Error updating user');
	}
};

const getUsers = async (req: Request, res: Response) => {
	try {
			const result: IUser[] = database.getUsers();
			res.status(200).json(result);
	}
	catch (err) {
		res.status(500).json({ error: err?.message });
	}
};

const getUserById = async (req: Request, res: Response) => {
	try {
		const personId = req.body.userId;
		if (personId) {
			const result: IUser = database.getUserById(personId);
			res.status(200).json(result);
		}
		else {
			res.status(404);
		}
	}
	catch (err) {
		res.status(500).json({ error: err?.message });
	}
};

const getUsernameById = async (req: Request, res: Response) => {
	try {
		const personId = parseInt(req.params.idUsuario, 10);

		if (personId) {
			const result: string = database.getUsernameById(personId);
			res.status(200).json(result);
		}
		else {
			res.status(404);
		}
	}
	catch (err) {
		res.status(500).json({ error: err?.message });
	}
};

const getPasswordById = async (req: Request, res: Response) => {
	try {
		const personId = parseInt(req.params.idUsuario, 10);

		if (personId) {
			const result: string = database.getPasswordById(personId);
			res.status(200).json(result);
		}
		else {
			res.status(404);
		}
	}
	catch (err) {
		res.status(500).json({ error: err?.message });
	}
};

const getUserCredentials = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const personId = req.params.idUsuario;

	try {
	  	const userIdNumber = parseInt(personId, 10);
	  	const credentials = database.getUserCredentials(userIdNumber);
	  	if (credentials) {
			res.status(200).json(credentials);
	  	}
		else {
			res.status(404).json({ error: 'User not found' });
	  	}
	}
	catch (err) {
	  	res.status(500).json({ error: err?.message });
	}
};

export default {
	getUserById,
	getUsers,
	createUser,
	validateUser,
	updateUser,
	getPasswordById,
	getUsernameById,
	getUserCredentials
};
