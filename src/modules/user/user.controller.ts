import { FastifyRequest, FastifyReply } from "fastify";
import { verifyPassword } from "../utils/hash";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.services";

async function registerUserHandler(request: FastifyRequest<{ Body: CreateUserInput}>, reply: FastifyReply){
    const body = request.body;
    try {
        const user = await createUser(body);
        reply.status(201).send(user);
    }
    catch (error) {
        reply.status(400).send(error);
    }
}

async function loginHandler(request: FastifyRequest<{ Body: LoginInput}>, reply: FastifyReply) {
    const body = request.body;
    
    const user = await findUserByEmail(body.email);
    if (!user) {
        return reply.status(401).send({
            error: "Invalid email or password"
        });
    }
    const { password, ...rest } = body;
    const correctPass = verifyPassword(password, user.salt, user.password)
    if (correctPass) {
        const {password, salt, ...rest} = user;
        return {accessToken: request.jwt.sign(rest)};
    }

    return reply.status(404).send({
        error: "Invalid email or password"
    });    
}

async function getUsersHandler(request: FastifyRequest, reply: FastifyReply) {
    return await findUsers();
}

export {registerUserHandler, loginHandler, getUsersHandler}