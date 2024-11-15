// handle api request for GET POST PUT DELETE
export default class RequestServices {
    API_URL: string
    constructor (APIEndPoint:string) {
        this.API_URL = `${process.env.REACT_APP_API_URL}/${APIEndPoint}`;
    }

    get = async<T> (endpoint:string, reqData?:object, token?:string) => {
        const data = await RequestServices.#fetchRequest(this.API_URL + endpoint, {
            method: "GET",
            token,
            searchParams: reqData? new URLSearchParams(reqData as any /* typescript dosen't want object in URLSeacrhParams */) : undefined
        })
        return data as T;
    }

    post = async<T> (endpoint:string, reqData:object, token?:string) => {
        const data = await RequestServices.#fetchRequest(this.API_URL + endpoint, {
            method: "POST",
            data: reqData,
            token
        })
        return data as T;
    }

    put = async<T> (endpoint:string, reqData:object, token?:string) => {
        const data = await RequestServices.#fetchRequest(this.API_URL + endpoint, {
            method: "PUT",
            data: reqData,
            token
        })
        return data as T;
    }

    delete = async<T> (endpoint:string, token?:string) => {
        const data = await RequestServices.#fetchRequest(this.API_URL + endpoint, {
            method: "DELETE",
            token
        })
        return data as T;
    }
    
    parseError = (err:any) => {
        if (err.response && err.response.data.error) return err.response.data.error;
        if (err.message) return err.message;
        else return err.toString();
    }

    static async #fetchRequest(url:string, options:{
        method: "GET" | "POST" | "DELETE" | "PUT",
        token?: string,
        data?: object,
        searchParams?: URLSearchParams
    }) {
        if (options.searchParams) url += "?" + options.searchParams.toString();
        // set headers
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if ("token" in options) headers['Authorization'] = `Bearer ${options.token}`;
        // send request
        const resp = await fetch(url, {
            method: options.method,
            headers,
            body: "data" in options ? JSON.stringify(options.data) : null,
        });
        // check request was successfull
        if (!resp.ok) throw new Error(`Request failed with status ${resp.status}: ${await resp.text()}`);
        // extract data
        const data = await resp.json();
        // check for error
        if (typeof data !== "object") throw new Error(`Invalid response of ${options.method} ${url}`);
        if ("error" in data) throw new Error(data.error);
        // return the data
        return data;
    }
}