import axios, { type AxiosRequestConfig } from "axios"
import { getScraperHeaders } from "./headerApi"

const baseurl = "https://api.shngm.io/v1"

const axiosInstance = axios.create({
    baseURL: baseurl,
    headers: getScraperHeaders(baseurl)
})

export const apiClient = async <T>(config: AxiosRequestConfig): Promise<T | undefined> => {
    const { data } = await axiosInstance(config)
    return data
}