const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;


const sql = postgres(URL, { ssl: 'require' });

async function getUsers() {

    try {
        return await sql`SELECT * FROM users`;
    } catch (error) {
        throw error
    }
}

async function setLastVisit(name) {
    await getUsers().then(async (data) => {
        let user = data.find((user) => {
            if (user.name === name) {
                return user;
            }
        });
        if (user) {
            await sql`UPDATE users SET (lastvisit,counter) = (${Date.now()},${user.counter+1}) WHERE name = ${name}`;

        }
    });

}

async function addNewUser(name) {
    let data = await getUsers();
    let user = data.find((user) => {
        if (user.name === name) {
            return user;
        }
    });
    if (!user) {
        await sql`INSERT INTO users (name, joined, lastvisit, counter) VALUES (${name}, ${Date.now()}, ${Date.now()}, 1)`;
    }
    else {
        let set = await setLastVisit(name);
    }

}

async function increaseCounter(name) {
    await getUsers().then(async (data) => {
        let user = data.find((user) => {
            if (user.name === name) {
                return user;
            }
        });
        if (user) {
            await sql`UPDATE users SET counter = ${user.counter + 1} WHERE name = ${name}`;

        }
    });

}

async function setJoined(name) {
    await getUsers().then( async (data) => {
        let user = data.find((user) => {
            if (user.name === name) {
                return user;
            }
        });
        if (user) {
            await sql`UPDATE users SET joined = ${Date.now()} WHERE name = ${name}`;

        }
    });
}
module.exports = {getUsers, setLastVisit, setJoined,addNewUser,increaseCounter};