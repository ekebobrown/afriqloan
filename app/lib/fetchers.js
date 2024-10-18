import useSWR from 'swr'

export function useFetcher(endpoint) {
    const fetcher = ([url]) => fetch(url, {signal: AbortSignal.timeout(30000)}).then(response => response.json()).then(data => data)
    const {data, error, isLoading, isValidating, mutate} = useSWR([`/${endpoint}`],
        fetcher,
        {
            keepPreviousData: true,
            refreshInterval: 60000,
            shouldRetryOnError: false
        })

    return {data, error, isLoading, isValidating, mutate}
}
