import express from "express";
import http from "http";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import fs from "fs";
import cors from "cors";
import loginRoutes from "./Routes/loginRoutes";
import { IResponse } from "./Interfaces/IResponse";
import userRoutes from "./Routes/userRoutes";
import productRoutes from "./Routes/productRoutes";

const app = express();
const RSA_PRIVATE_KEY = fs.readFileSync("private.key");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
    	"Access-Control-Allow-Headers",
    	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
  	);

	if (req.method === "OPTIONS") {
    	res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    	return res.status(200).json({});
  	}
  	next();
});

app.use("/login", loginRoutes);

app.use((req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, RSA_PRIVATE_KEY, (err: Error) => {
			if (err) {
				const response: IResponse<any> = {
					stsCode: "403",
					stsMsg: "Unauthorized",
					data: {},
				};
				res.status(403).json(response);
			} else {
				next();
			}
		});
  	}
	else {
    	const response: IResponse<any> = {
			stsCode: "401",
			stsMsg: "Unauthorized",
			data: {},
	    };
    	res.status(401).json(response);
  	}
});

/** Routes go here */
app.use("/user", userRoutes);
app.use('/products', productRoutes);

/** Error handling */
app.use((req, res, next) => {
	const error = new Error("Not found");

  	res.status(404).json({
    	message: error.message,
  	});
});

const httpServer = http.createServer(app);
httpServer.listen(3000);
