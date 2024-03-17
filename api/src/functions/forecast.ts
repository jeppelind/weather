import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getLocationFromCache, updateCache } from "../cache";

const isCacheNotTooOld = (lastUpdate: number) => {
    const maxAgeSeconds = 1800;
    const currentTimeSeconds = Date.now() / 1000;
    return (currentTimeSeconds - lastUpdate) < maxAgeSeconds;
}

export async function forecast(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    var location = request.query.get('location');
    if (!location) {
        return { status: 400, body: 'Missing location parameter' }
    }

    const cachedData = getLocationFromCache(location);
    if (cachedData && isCacheNotTooOld(cachedData.location.localtime_epoch)) {
        context.log(`Fetched ${location} from cache`);
        return { jsonBody: cachedData }
    }

    try {
         const URL = `${process.env.API_SOURCE}/forecast.json?key=${process.env.API_KEY}&q=${location}`;
         context.log(`Fetch from ${URL}`);
        const res = await fetch(URL);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        var data = await res.json();
        updateCache(location, data);
        return { jsonBody: data };
    } catch (err) {
        return { status: 500, body: err }
    }
};

app.http('forecast', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: forecast
});
