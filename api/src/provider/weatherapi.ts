// Parse data from weatherapi.com

const getDataPerDay = (data) => {
    const { maxtemp_c, maxtemp_f, mintemp_c, mintemp_f, daily_chance_of_rain, condition: { code } } = data;
    return {
        maxtemp_c: Math.round(maxtemp_c),
        maxtemp_f: Math.round(maxtemp_f),
        mintemp_c: Math.round(mintemp_c),
        mintemp_f: Math.round(mintemp_f),
        daily_chance_of_rain,
        code,
    }
}

const getDataPerHour = (data: any[]) => {
    const hours = [];
    data.forEach(hour => {
        const { time_epoch, time, temp_c, temp_f, chance_of_rain, is_day, condition: { code } } = hour;
        hours.push({
            time_epoch: time_epoch * 1000,
            time,
            is_day,
            temp_c: Math.round(temp_c),
            temp_f: Math.round(temp_f),
            chance_of_rain,
            code,
        });
    });
    return hours;
}

const getLocationData = (data) => {
    const { name, country, localtime_epoch } = data.location;
    return {
        name,
        country,
        last_updated: localtime_epoch * 1000, // Data is in seconds
    };
}

const getCurrentData = (data) => {
    const { temp_c, temp_f, is_day, condition: { text, code }, precip_mm, precip_in,
        feelslike_c, feelslike_f } = data.current;

    const { maxtemp_c, maxtemp_f, mintemp_c, mintemp_f } = getDataPerDay(data.forecast.forecastday[0].day);

    return {
        is_day, 
        condition: { text, code },
        precip_mm,
        precip_in,
        temp_c: Math.round(temp_c),
        temp_f: Math.round(temp_f),
        feelslike_c: Math.round(feelslike_c),
        feelslike_f: Math.round(feelslike_f),
        maxtemp_c,
        maxtemp_f,
        mintemp_c,
        mintemp_f,
    }
}

const getForecast = (data: any[]) => {
    const dailyForecast = [];
    const hourlyForecast = [];
    data.forEach(day => {
        const { date } = day;
        const dayData = getDataPerDay(day.day);
        const hoursByDay = getDataPerHour(day.hour);
        dailyForecast.push({ date, ...dayData });
        hourlyForecast.push(...hoursByDay);
    });
    return {
        days: dailyForecast,
        hours: hourlyForecast.slice(0, 31), // Only return limited hours forecast
    }
}

export const parseData = (data) => {
    return {
        location: getLocationData(data),
        current: getCurrentData(data),
        forecast: getForecast(data.forecast.forecastday),
    };
}