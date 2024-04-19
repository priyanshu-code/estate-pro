import axios from "axios"
const url = process.env.NEXT_PUBLIC_BACKEND_URL

export const createProperty = async (data, token) => {
    try {
        const response = await axios.post(url + 'property',
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                },
            })
        if (response.status === 201) {
            return { error: false, msg: response.data.msg, data: response.data }
        }
        return { error: true, msg: response.data.msg }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message }
    }
}

export const updateProperty = async ({ propertyId, data, token }) => {
    try {
        const response = await axios.patch(url + 'property/' + propertyId,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        if (response.status === 200) {
            return { error: false, msg: response.data.msg, data: response.data }
        }
        return { error: true, msg: response.data.msg, data: null }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message, data: null }
    }
}

export const deleteProperty = async (propertyId, token) => {
    try {
        const response = await axios.delete(url + 'property/' + propertyId, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.status === 200) {
            return { error: false, msg: response.data.msg, data: response.data }
        }
        return { error: true, msg: response.data.msg, data: null }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message, data: null }
    }
}


export const getFilteredProperties = async (data) => {
    try {
        const response = await axios.post(url + 'public/getFilteredProperties', data)
        if (response.status === 200) {
            return { error: false, msg: response.data.msg, data: response.data }
        }
        return { error: true, msg: response.data.msg, properties: null }
    } catch (error) {
        console.log(error)
        return { error: true, msg: error.response?.data?.msg || error.message, properties: null }
    }
}