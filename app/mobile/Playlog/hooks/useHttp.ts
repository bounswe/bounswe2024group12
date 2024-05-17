import {useState, useCallback, useRef, useEffect} from 'react';

export function useHttp<T>() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();

    const activeHttpRequests = useRef<AbortController[]>([]);
    const sendRequest = useCallback(
        async (url: string, method: 'GET' | "POST" | "UPDATE" | "DELETE" = 'GET', body: T & BodyInit | null = null, headers: HeadersInit | undefined = {}): Promise<any> => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try {
                // console.log("URL: ",url);
                const response = await fetch(url, {
                    method,
                    body,
                    headers: {
                        'Content-type': 'application/json',
                        ...headers
                    },
                    signal: httpAbortCtrl.signal
                });
                console.log("Body: ", body);

                const responseData = await response.json();

                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                );
                console.log("CODE: ", response.status)
                console.log(responseData)
                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);
                return responseData;
            } catch (err: any) {
                console.error(err.message)
                setError(err.message);
                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return {isLoading, error, sendRequest, clearError};
}
