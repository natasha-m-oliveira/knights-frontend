import { apiUrl } from "@/config/config";

import axios from "axios";

export default axios.create({
  baseURL: apiUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json;charset=UTF-8"
  }
})