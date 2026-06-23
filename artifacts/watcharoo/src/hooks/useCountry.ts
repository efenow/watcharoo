import { useState, useEffect } from "react";

export function useCountry() {
  const [country, setCountry] = useState<string>(() => {
    return localStorage.getItem("watcharoo_country") || "";
  });

  useEffect(() => {
    if (!country) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_code) {
            setCountry(data.country_code);
            localStorage.setItem("watcharoo_country", data.country_code);
          } else {
            setCountry("US");
          }
        })
        .catch(() => setCountry("US"));
    }
  }, [country]);

  const updateCountry = (newCountry: string) => {
    setCountry(newCountry);
    localStorage.setItem("watcharoo_country", newCountry);
  };

  return { country: country || "US", setCountry: updateCountry };
}