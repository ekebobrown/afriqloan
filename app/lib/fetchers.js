import useSWR from 'swr'

export function useFetcher(endpoint) {
    const fetcher = ([url]) => fetch(url, {signal: AbortSignal.timeout(30000)}).then(response =>  {return response.data})
    const {data, error, isLoading, isValidating, mutate} = useSWR([process.env.SITE_URL + `/${endpoint}`],
        fetcher,
        {
            keepPreviousData: true,
            refreshInterval: 60000,
            shouldRetryOnError: false
        })

    return {data, error, isLoading, isValidating, mutate}
}
