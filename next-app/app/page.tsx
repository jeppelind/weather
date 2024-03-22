import { WiThermometer } from "react-icons/wi";
import WeatherIcon from "./_components/weather-icon";

type Forecast = {
  location: {
    name: string,
    country: string,
  },
  current: {
    is_day: number,
    condition: {
      text: string,
      code: number,
    },
    temp_c: number,
    temp_f: number,
    feelslike_c: number,
    feelslike_f: number,
    maxtemp_c: number,
		maxtemp_f: number,
		mintemp_c: number,
	  mintemp_f: number,
    precip_mm: number,
    precip_in: number,
  },
  forecast: {},
}

const getForecast = async (location: string) => {
  const URL = `${process.env.API_URL}/forecast?location=${location}`;
  const res = await fetch(URL, {
    next: {
      revalidate: 3600, // Cache age in seconds
    }
  });
  if (!res.ok) {
    throw new Error(`Error fetching data. ${res.statusText}`);
  }
  const data: Forecast = await res.json();
  return data;
}

export default async function Home({
  searchParams
}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  console.log(searchParams)
  const { l, t } = searchParams;
  
  if (l && typeof l === 'string') {
    try {
      const data = await getForecast(l);
      return (
        <main className="flex min-h-screen flex-col items-center pt-24">
          <p>{data.location.name}, {data.location.country}</p>
          <div className="text-8xl font-bold text-slate-800 dark:text-slate-200 m-4 mb-1">
            {(t === 'f') ? data.current.temp_f : data.current.temp_c}°
          </div>
          <div className="flex items-center text-lg text-slate-800 dark:text-slate-200">
            <span className="text-7xl">
              <WeatherIcon code={data.current.condition.code} isDay={data.current.is_day === 1} />
            </span>
            {data.current.condition.text}
          </div>
          <p>Feels like {(t === 'f') ? data.current.feelslike_f : data.current.feelslike_c}°</p>
          <div className="mt-3">
            High: {(t === 'f') ? data.current.maxtemp_f : data.current.maxtemp_c}° | Low: {(t === 'f') ? data.current.mintemp_f : data.current.mintemp_c}°
          </div>
        </main>
      )
    } catch (err) {
      console.error(err)
      return (
        <main className="flex items-center flex-col">
          <div className="flex min-h-screen flex-col justify-center items-center">
            <WiThermometer className="text-7xl" />
            <p>Problem fetching data</p>
          </div>
        </main>
      )
    }
  }
}
