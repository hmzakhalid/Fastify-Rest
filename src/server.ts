import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import FastifyJWT, { JWT } from '@fastify/jwt';
import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';


declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT;
    }
    interface FastifyInstance {
        authenticate: any
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            email: string;
            name: string;
        };
    }
}

function buildServer() {
    const server = Fastify();

    server.register(FastifyJWT, {
        secret: "AJsajksaskjabsKBJAKSB7BSA*91n2jnkja"
    })

    server.addHook('preHandler', async (request, reply, done) => {
        const { authorization } = request.headers;
        if (authorization) {
            const [, token] = authorization.split(' ');
            request.jwt = await server.jwt.verify(token);
        }
        done();
    })

    server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            return reply.send(error)
        }
    })

    server.get("/healthcheck", async () => {
        return { status: 200, message: "OK" };
    })


    for (const schema of [...userSchemas, ...productSchemas]) {
        server.addSchema(schema);
    }

    server.register(userRoutes, { prefix: "api/users" })
    server.register(productRoutes, { prefix: "api/products" })
    return server;
}

export default buildServer;