import {IResponse} from '@/models/response';

const base_url = process.env.NEXT_PUBLIC_API_URL;

const getPedidos = async (page: number = 1, pageSize: number = 10): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_pedidos?page=${page}&pageSize=${pageSize}`,{
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("token")}`
        }
    });
    const data = await res.json();
    return data;
}

const searchPedidos = async (textoBuscar: string, page: number = 1, pageSize: number = 10): Promise<IResponse> => {
    const res = await fetch(`${base_url}/buscar_pedido_by_ticket?ticket=${textoBuscar}&page=${page}&pageSize=${pageSize}`);
    const data = await res.json();
    return data;
}

const deletePedido = async (id: string): Promise<IResponse> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/delete_pedido/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
}

const getPedidoById = async (id: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_pedido_by_id/${id}`);
    const data = await res.json();
    return data;
}

const completarPedido = async (id: string): Promise<IResponse> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/completar_pedido/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
}

export { getPedidos, searchPedidos, deletePedido, getPedidoById, completarPedido };