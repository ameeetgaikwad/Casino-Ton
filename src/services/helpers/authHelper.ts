import { Cookies } from 'react-cookie';
export const getJwt = async (address: string) => {
    const cookies = new Cookies();
    const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ address: address }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
    const result = await res.json()
    cookies.set('token', result.token)
    return result
}

export const checkJwt = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');

    const res = await fetch('/api/checkjwt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }
    )
    const result = await res.json()
    console.log(result, 'result')
    return result
}

export const getUserBalance = async () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const res = await fetch('/api/userBalance', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }
    )
    const result = await res.json()
    console.log(result, 'result')
    return result
}

