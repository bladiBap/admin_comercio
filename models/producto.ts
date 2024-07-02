export interface IProducto {
    id:          number;
    nombre:      string;
    descripcion: string;
    precio:      number;
    stock:       number;
    peso:        number;
    createdAt:   Date;
    updatedAt:   Date;
    imagenes:    IImagen[];
}

export interface IImagen {
    id:          number;
    img_url:     string;
    fk_producto: number;
    createdAt:   Date;
    updatedAt:   Date;
}