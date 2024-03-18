import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function search(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const query = request.query.get('query');
    if (!query) {
        return { status: 400, body: 'Missing query parameter' }
    }

    try {
        const URL = `${process.env.API_SOURCE}/search.json?key=${process.env.API_KEY}&q=${query}`;
        const res = await fetch(URL);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        return { jsonBody: data }
    } catch (err) {
        return { status: 500, body: err }
    }
};

app.http('search', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: search
});
