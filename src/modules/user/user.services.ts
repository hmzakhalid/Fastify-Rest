import prisma from "../utils/prisma";
import { CreateUserInput } from "./user.schema";
import { hashPassword } from "../utils/hash";

async function createUser(input: CreateUserInput) {
    const { password, ...rest } = input;
    const { hash, salt } = hashPassword(password);
    const user = await prisma.user.create({
        data: {...rest, password: hash, salt}
    })
    return user;
}

async function findUserByEmail(email: string){
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

async function findUsers(){
    return prisma.user.findMany({
        select:{
            id: true,
            name: true,
            email: true
        }
    });
}

export { createUser, findUserByEmail, findUsers };