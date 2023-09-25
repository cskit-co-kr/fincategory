import { useEffect, useState } from 'react';

function useData(url: string, method: string) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url, {
      method: method,
      headers: { 'content-type': 'application/json' },
    })
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}

export default useData;
