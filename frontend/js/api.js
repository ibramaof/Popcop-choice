const API_BASE_URL = 'http://localhost:3000/api'

export const getRecommendation = async (userInput) => {
    try {
        const response = await fetch(`${API_BASE_URL}/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInput)
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('API call failed:', error)
        throw error
    }
}