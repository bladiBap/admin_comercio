import IResponse from '@/models/response';

const base_url = process.env.NEXT_PUBLIC_API_URL;

const getUsuarioByToken = async (): Promise<IResponse> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/get_user_by_token`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
};

const login = async (email: string, password: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/login_admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data;
};

export {getUsuarioByToken , login};