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
  const { loc, t } = searchParams;

  
  if (loc && typeof loc === 'string') {
    try {
      const data = await getForecast(loc);
      return (
        <main className="flex min-h-screen flex-col items-center pt-24">
          <p>{data.location.name}, {data.location.country}</p>
          <div className="text-8xl font-bold text-slate-800 dark:text-slate-200 m-4">
            {(t === 'f') ? data.current.temp_f : data.current.temp_c}°
          </div>
          <div className="text-lg text-slate-800 dark:text-slate-200">{data.current.condition.text}</div>
          <p>Feels like {(t === 'f') ? data.current.feelslike_f : data.current.feelslike_c}°</p>
          <div className="mt-3">
            High: {(t === 'f') ? data.current.maxtemp_f : data.current.maxtemp_c}° | Low: {(t === 'f') ? data.current.mintemp_f : data.current.mintemp_c}°
          </div>
        </main>
      )
    } catch (err) {
      console.error(err)
      return (
        <main>
          <p>Problem fetching data</p>
        </main>
      )
    }
  }
}
