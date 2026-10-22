
import { useEffect, useState } from "react";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/info?returns=name,capital,population,flag,continent"
        );

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("API se valid country list nahi mili.");
        }

        const formattedCountries = result.data.map((country) => ({
          name: country.name || "Unknown",
          capital: country.capital || "N/A",
          population: country.population,
          flag: country.flag || "",
          region: country.continent || "N/A",
        }));

        setCountries(
          formattedCountries.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      } catch (err) {
        console.error("Country API error:", err);
        setError(
          "Country data load nahi hua. Please Retry par click karein."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-600">
            Country Explorer
          </h1>
          <p className="mt-2 text-slate-500">
            Search and explore countries around the world.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto mb-8 max-w-xl">
          <label
            htmlFor="country-search"
            className="mb-2 block font-medium"
          >
            Search country
          </label>

          <input
            id="country-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by country name..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          {!loading && !error && (
            <p className="mt-2 text-sm text-slate-500">
              {filteredCountries.length} countries found
            </p>
          )}
        </div>

        {loading && (
          <p className="py-12 text-center">Loading countries...</p>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredCountries.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            No countries found.
          </p>
        )}

        {!loading && !error && filteredCountries.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCountries.map((country) => (
              <article
                key={country.name}
                className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {country.flag ? (
                  <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    loading="lazy"
                    className="mb-4 h-36 w-full rounded-xl bg-slate-100 object-contain"
                  />
                ) : (
                  <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-slate-100 text-5xl">
                    🌍
                  </div>
                )}

                <h2 className="mb-3 text-xl font-bold">
                  {country.name}
                </h2>

                <p className="mb-2 text-sm text-slate-600">
                  <strong className="text-slate-800">Capital:</strong>{" "}
                  {country.capital}
                </p>

                <p className="mb-2 text-sm text-slate-600">
                  <strong className="text-slate-800">Region:</strong>{" "}
                  {country.region}
                </p>

                <p className="text-sm text-slate-600">
                  <strong className="text-slate-800">Population:</strong>{" "}
                  {typeof country.population === "number"
                    ? country.population.toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
