const API_BASE = (process.env.API_BASE || 'http://localhost:3001/api').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secret';
const SEATS = Math.max(1, parseInt(process.env.SEATS || '10', 10));
const USERS = Math.max(SEATS, parseInt(process.env.USERS || '1000', 10));
const REGISTER_CONCURRENCY = Math.max(1, parseInt(process.env.REGISTER_CONCURRENCY || '40', 10));

function jsonHeaders(token) {
    const h = { 'Content-Type': 'application/json', Accept: 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
}

async function postJson(path, body, token) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: jsonHeaders(token),
        body: JSON.stringify(body),
    });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }
    return { status: res.status, data };
}

async function getJson(path, token) {
    const res = await fetch(`${API_BASE}${path}`, { headers: jsonHeaders(token) });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }
    return { status: res.status, data };
}

async function poolMap(items, concurrency, iterator) {
    const results = new Array(items.length);
    let idx = 0;
    async function worker() {
        while (idx < items.length) {
            const i = idx++;
            results[i] = await iterator(items[i], i);
        }
    }
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
    await Promise.all(workers);
    return results;
}

async function main() {
    console.log(
        `API_BASE=${API_BASE} SEATS=${SEATS} USERS=${USERS} REGISTER_CONCURRENCY=${REGISTER_CONCURRENCY}`,
    );

    const adminLogin = await postJson('/v1/auth/email/login', {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    });
    if (adminLogin.status !== 200) {
        console.error('Admin login failed:', adminLogin.status, adminLogin.data);
        process.exit(1);
    }
    const adminToken = adminLogin.data.token;

    const concertName = `Race test ${new Date().toISOString()}`;
    const created = await postJson(
        '/v1/concerts',
        {
            name: concertName,
            description: 'Concurrency burst fixture',
            totalSeats: SEATS,
        },
        adminToken,
    );
    if (created.status !== 201) {
        console.error('Create concert failed:', created.status, created.data);
        process.exit(1);
    }
    const concertId = created.data.id;
    console.log(`Created concert ${concertId} (${SEATS} seats). Registering ${USERS} users...`);

    const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const indices = Array.from({ length: USERS }, (_, i) => i);

    const registerOne = async (i) => {
        const email = `race-${runId}-${i}@burst.test`;
        const reg = await postJson('/v1/auth/email/register', {
            email,
            password: 'secretsecret',
            firstName: 'Race',
            lastName: `U${i}`,
        });
        if (reg.status !== 200) {
            return { ok: false, email, status: reg.status, data: reg.data };
        }
        return { ok: true, email, token: reg.data.token };
    };

    const registered = await poolMap(indices, REGISTER_CONCURRENCY, registerOne);
    const failedReg = registered.filter((r) => !r.ok);
    if (failedReg.length) {
        console.error(
            `Registration failures: ${failedReg.length} (showing up to 5)`,
            failedReg.slice(0, 5),
        );
        process.exit(1);
    }
    const tokens = registered.map((r) => r.token);

    console.log('Firing concurrent reservation requests...');
    const t0 = Date.now();
    const reserveOutcomes = await Promise.allSettled(
        tokens.map((token) =>
            fetch(`${API_BASE}/v1/concerts/${concertId}/reservations`, {
                method: 'POST',
                headers: jsonHeaders(token),
            }).then(async (res) => {
                const text = await res.text();
                let body;
                try {
                    body = text ? JSON.parse(text) : null;
                } catch {
                    body = text;
                }
                return { status: res.status, body };
            }),
        ),
    );
    const elapsed = Date.now() - t0;

    let createdN = 0;
    let soldOut = 0;
    let other = 0;
    const otherSamples = [];

    for (const o of reserveOutcomes) {
        if (o.status === 'rejected') {
            other++;
            if (otherSamples.length < 5) otherSamples.push({ err: String(o.reason) });
            continue;
        }
        const { status } = o.value;
        if (status === 201) createdN++;
        else if (status === 409) soldOut++;
        else {
            other++;
            if (otherSamples.length < 5) otherSamples.push(o.value);
        }
    }

    const concert = await getJson(`/v1/concerts/${concertId}`, adminToken);
    const view = concert.status === 200 ? concert.data : null;

    console.log('\n--- Results ---');
    console.log(`Reservation phase: ${elapsed}ms`);
    console.log(`HTTP 201 created:     ${createdN}`);
    console.log(`HTTP 409 conflict:    ${soldOut}`);
    console.log(`Other / network err:  ${other}`);
    if (otherSamples.length) console.log('Samples (other):', JSON.stringify(otherSamples, null, 2));

    if (view) {
        console.log('\nConcert snapshot:');
        console.log(
            JSON.stringify(
                {
                    reservedCount: view.reservedCount,
                    remainingSeats: view.remainingSeats,
                    soldOut: view.soldOut,
                    totalSeats: view.totalSeats,
                },
                null,
                2,
            ),
        );
    } else {
        console.error('Could not GET concert:', concert.status, concert.data);
    }

    const totalHandled = createdN + soldOut + other;
    const dbOk =
        view && view.reservedCount === SEATS && view.remainingSeats === 0 && view.soldOut === true;
    const overbooked = view && view.reservedCount > SEATS;
    const countsMatch =
        createdN === SEATS && soldOut === USERS - SEATS && totalHandled === USERS && other === 0;

    console.log('\n--- Assertion ---');
    if (overbooked) {
        console.log(
            `FAIL: over-booking — reservedCount=${view.reservedCount} exceeds capacity ${SEATS}.`,
        );
    } else if (dbOk) {
        console.log(`PASS: database shows exactly ${SEATS} active reservations (no over-booking).`);
    } else {
        console.log(
            `FAIL: expected reservedCount=${SEATS} and remainingSeats=0; got ${JSON.stringify(
                view
                    ? {
                          reservedCount: view.reservedCount,
                          remainingSeats: view.remainingSeats,
                          soldOut: view.soldOut,
                      }
                    : null,
            )}`,
        );
    }
    if (countsMatch) {
        console.log(
            `PASS: HTTP layer — ${SEATS}×201 and ${USERS - SEATS}×409, no other status codes.`,
        );
    } else if (dbOk) {
        console.log(
            `NOTE: HTTP mix differed (201: ${createdN}, 409: ${soldOut}, other: ${other} / total ${totalHandled}). Check API logs if other>0.`,
        );
    }

    const exitCode = dbOk && !overbooked ? 0 : 1;
    process.exit(exitCode);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
