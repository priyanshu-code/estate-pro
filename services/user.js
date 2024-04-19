import axios from "axios"
const url = process.env.NEXT_PUBLIC_BACKEND_URL

export const favoriteProperty = async ({ propertyId, token }) => {
    try {
        const response = await axios.patch(url + 'property/favoriteProperty',
            { propertyId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        if (response.status === 200) {
            return { error: false, msg: response.data.msg, user: response.data.user }
        }
        return { error: true, msg: response.data.msg }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message }
    }
}

export const unFavoriteProperty = async ({ propertyId, token }) => {
    try {
        const response = await axios.patch(url + 'property/unFavoriteProperty',
            { propertyId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        if (response.status === 200) {
            return { error: false, msg: response.data.msg, user: response.data.user }
        }
        return { error: true, msg: response.data.msg }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message }
    }
}

export const checkLatestUser = async (token) => {
    try {
        const response = await axios.get(url + 'user/checkLatestUser',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        if (response.status === 200) {
            return { error: false, latestUser: response.data.latestUser }
        }
        return { error: true, user: response?.data?.latestUser || null }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message }
    }

}