// Parse data from weatherapi.com

const getLocationData = (data) => {
    const { name, country, localtime_epoch } = data.location;
    return { name, country, last_updated: localtime_epoch };
}

const getCurrentData = (data) => {
    const { temp_c, temp_f, is_day, condition: { text, code }, precip_mm, precip_in,
        feelslike_c, feelslike_f } = data.current;

    const { maxtemp_c, maxtemp_f, mintemp_c, mintemp_f } = data.forecast.forecastday[0].day;

    return {
        is_day, condition: { text, code }, precip_mm, precip_in,
        temp_c: Math.round(temp_c),
        temp_f: Math.round(temp_f),
        feelslike_c: Math.round(feelslike_c),
        feelslike_f: Math.round(feelslike_f),
        maxtemp_c: Math.round(maxtemp_c),
        maxtemp_f: Math.round(maxtemp_f),
        mintemp_c: Math.round(mintemp_c),
        mintemp_f: Math.round(mintemp_f),
    }
}

export const parseData = (data) => {
    return {
        location: getLocationData(data),
        current: getCurrentData(data),
        forecast: {},
    };
}