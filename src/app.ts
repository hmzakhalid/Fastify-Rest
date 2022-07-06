import buildServer from './server';

const server = buildServer();


async function main() {

    try {
        await server.listen({
            port: 3000,
            host: '0.0.0.0'
        });
        console.log('server listening on port 3000');
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}
main();