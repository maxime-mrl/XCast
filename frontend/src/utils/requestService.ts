/* -------------------------------------------------------------------------- */
/*                   UTILITY SERVICE TO HANDLE HTTP REQUEST                   */
/* -------------------------------------------------------------------------- */
export default class RequestServices {
    private API_URL: string;

    constructor (APIEndPoint: string) {
        this.API_URL = `${process.env.REACT_APP_API_URL}/${APIEndPoint}`; // for local dev
        this.API_URL = `http://${window.location.hostname}/${APIEndPoint}`;
    }

    /* ------------------------------ Request types ----------------------------- */
    get = async<T> (endpoint:string, reqData?:object, token?:string): Promise<T> => {
        const data = await RequestServices.fetchRequest<T>(this.API_URL + endpoint, {
            method: "GET",
            token,
            searchParams: reqData? new URLSearchParams(reqData as Record<string, string> /* typescript dosen't want object in URLSeacrhParams even if it's working */) : undefined
        });
        return data as T;
    }

    post = async<T> (endpoint:string, reqData:object, token?:string) => {
        const data = await RequestServices.fetchRequest<T>(this.API_URL + endpoint, {
            method: "POST",
            data: reqData,
            token
        });
        return data as T;
    }

    put = async<T> (endpoint:string, reqData:object, token?:string) => {
        const data = await RequestServices.fetchRequest<T>(this.API_URL + endpoint, {
            method: "PUT",
            data: reqData,
            token
        });
        return data as T;
    }

    delete = async<T> (endpoint:string, token?:string) => {
        const data = await RequestServices.fetchRequest<T>(this.API_URL + endpoint, {
            method: "DELETE",
            token
        });
        return data as T;
    }
    
    /* ----------- Parse any errors to the best text version available ---------- */
    parseError = (err:any) => {
        if (err.response && err.response.data.error) return err.response.data.error;
        if (err.message) return err.message;
        return err.toString();
    }

    /* ---------------- execute fetching (used by get / post...) ---------------- */
    private static async fetchRequest<T>(url:string, options:{
        method: "GET" | "POST" | "DELETE" | "PUT",
        token?: string,
        data?: object,
        searchParams?: URLSearchParams
    }): Promise<T> {
        // set headers
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        // optionnal params
        if (options.searchParams) url += "?" + options.searchParams.toString();
        if (options.token) headers['Authorization'] = `Bearer ${options.token}`;
        // send request
        const resp = await fetch(url, {
            method: options.method,
            headers,
            body: "data" in options ? JSON.stringify(options.data) : undefined,
        });
        // check request was successfull
        if (!resp.ok) throw new Error(`Request failed with status ${resp.status}: ${await resp.text()}`);
        // extract data
        const data = await resp.json();
        // check for error
        if (typeof data !== "object") throw new Error(`Invalid response of ${options.method} ${url}`);
        if ("error" in data) throw new Error(data.error);
        // return the data
        return data as T;
    }
}