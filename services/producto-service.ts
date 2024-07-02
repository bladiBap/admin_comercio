import {IResponse} from '@/models/response';

const base_url = process.env.NEXT_PUBLIC_API_URL;

const getProductos = async (page: number = 1, pageSize: number = 10): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_productos?page=${page}&pageSize=${pageSize}`);
    const data = await res.json();
    return data;
}

const searchProductos = async (textoBuscar: string, page: number = 1, pageSize: number = 10): Promise<IResponse> => {
    const res = await fetch(`${base_url}/buscar_producto?texto=${textoBuscar}&page=${page}&pageSize=${pageSize}`);
    const data = await res.json();
    return data;
}

const deleteProducto = async (id: string): Promise<IResponse> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/delete_producto/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data;
}

const getProductoById = async (id: string): Promise<IResponse> => {
    const res = await fetch(`${base_url}/get_producto_by_id/${id}`);
    const data = await res.json();
    return data;
}

const insertProducto = async (formData: FormData): Promise<void> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/create_producto`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    const data = await res.json();
    return data;
}

const updateProducto = async (id: string, formData: FormData): Promise<void> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/update_producto/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    const data = await res.json();
    return data;
}

const insertManyImagesProducto = async (formData: FormData, id : number): Promise<void> => {
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/add_imagen_to_producto/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    const data = await res.json();
    return data;
}

const deleteImagesProducto = async ( ids: any, id: string): Promise<void> => {
    console.log(ids);
    let token = sessionStorage.getItem("token");
    const res = await fetch(`${base_url}/delete_imagenes_producto/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids : ids
        })
    });
    const data = await res.json();
    return data;
}

export { getProductos, searchProductos, deleteProducto, getProductoById,
    insertProducto, updateProducto, insertManyImagesProducto, deleteImagesProducto
};