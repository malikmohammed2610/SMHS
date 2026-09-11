const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const db = new Database(path.join(__dirname, "school.db"));

async function resetPrincipal() {
    const username = "st.martins@principal";
    const password = "Megha Sen";

    const passwordHash = await bcrypt.hash(password, 12);

    const existing = db
        .prepare("SELECT id FROM principals LIMIT 1")
        .get();

    if (existing) {
        db.prepare(`
            UPDATE principals
            SET username = ?, password_hash = ?
            WHERE id = ?
        `).run(username, passwordHash, existing.id);

        console.log("==========================================");
        console.log(" PRINCIPAL ACCOUNT UPDATED");
        console.log(" Username:", username);
        console.log(" Password:", password);
        console.log("==========================================");
    } else {
        db.prepare(`
            INSERT INTO principals (username, password_hash)
            VALUES (?, ?)
        `).run(username, passwordHash);

        console.log("==========================================");
        console.log(" PRINCIPAL ACCOUNT CREATED");
        console.log(" Username:", username);
        console.log(" Password:", password);
        console.log("==========================================");
    }

    db.close();
}

resetPrincipal().catch(error => {
    console.error("ERROR:", error);
    process.exit(1);
});