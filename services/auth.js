import axios from "axios"
const url = process.env.NEXT_PUBLIC_BACKEND_URL
export const registerUser = async (data) => {
    try {
        const response = await axios.post(url + 'auth/register', data)
        if (response.status === 201) {
            return { error: false, msg: response.data.msg }
        }
        return { error: true, msg: response.data.msg }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response.data.msg }
    }
}