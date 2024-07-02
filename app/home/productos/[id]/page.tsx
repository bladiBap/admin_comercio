"use client";
import { toast } from 'react-toastify';
import { useEffect, useState, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {CircularProgress, Input, Textarea, Button, Divider, Image} from "@nextui-org/react";
import {getProductoById, insertProducto, deleteImagesProducto,insertManyImagesProducto,
    updateProducto } from '@/services/producto-service';
import {getUsuarioByToken} from '@/services/usuario-service';
import Slider from '@/components/slider-img/slider-img';

import style from './page.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const FormPage = ({ params }: any) => {

    const [id , setId] = useState('');
    const [loading, setLoading] = useState(true);
    const [producto, setProducto] = useState<any | null>({});
    const [uploadCaruselBase64, setUploadCaruselBase64] = useState([]);
    const [uploadCaruselFiles, setUploadCaruselFiles] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [clickSendForm, setClickSendForm] = useState(false);
    const router = useRouter();

    


    useEffect(() => {
        async function fetchData() {
            const res = await getUsuarioByToken();
            if (res.success !== true) return router.push('/');
            const {id} = params;
            if (!id || (id !== 'create' && isNaN(id))) {
                return router.push('/home/productos');
            }
            setId(id);
            if (id !== 'create') {
                getProductoById(id).then((res) => {
                    if (res.success) {
                        setProducto(res.data);
                    }else{
                        router.push('/home/productos');
                    }
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    setLoading(false);
                });
            } else {
                setProducto({
                    nombre: '',
                    precio: 0,
                    stock: 0,
                    peso: 0,
                    descripcion: '',
                    imagenes: [],
                });
                setLoading(false);
            };
        }
        fetchData();
    }, [
        params,
        router
    ]);
    
    const onFilesImagesChangeCarusel = (event : any) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setUploadCaruselFiles([...uploadCaruselFiles, ...files]);
        const promises : Promise<string>[] = [];
        for (const file of files) {
            const reader = new FileReader();
            promises.push(new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    resolve(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
            ));
        }
        Promise.all(promises).then((values) => {
            setUploadCaruselBase64([...uploadCaruselBase64, ...values]);
        });
    };

    const eliminarImagenCarusel = (index : number) => {
        const newImages = [...uploadCaruselBase64];
        newImages.splice(index, 1);
        setUploadCaruselFiles(uploadCaruselFiles.filter((file, i) => i !== index));
        setUploadCaruselBase64(newImages);
    };

    const onClickCheckImage = (id : number) => {
        const newImages = [...imagesToDelete];
        if (newImages.includes(id)) {
            newImages.splice(newImages.indexOf(id), 1);
        }else{
            newImages.push(id);
        }
        setImagesToDelete(newImages);
    }

    const onSubmitForm = (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setClickSendForm(true);
        let formData = new FormData();

        if (uploadCaruselBase64.length === 0 && id === 'create') {
            addFocus('carusel');
            return;
        }

        if (uploadCaruselFiles.length > 0 && id === 'create') {
            uploadCaruselFiles.forEach((file) => {
                formData.append('imagenes', file);
            });
        }
        
        if (producto?.nombre === '' || producto?.precio === 0 || producto?.stock === 0 || producto?.peso === 0 || producto?.descripcion === '') {
            showToast('Debe de llenar todos los campos', 'error');
            return;
        }

        formData.append('nombre', producto?.nombre);
        formData.append('precio', producto?.precio.toString());
        formData.append('stock', producto?.stock.toString());
        formData.append('peso', producto?.peso.toString());
        formData.append('descripcion', producto?.descripcion);
        
        guardarProducto(formData);
    }

    const guardarProducto = async (formData : FormData) => {
        if (id === 'create') {
            insertProducto(formData).then((res) => {
                if (res.success === true) {
                    showToast('Producto creado correctamente', 'success');
                    router.push('/home/productos');
                }else{
                    showToast(res.message, 'error');
                }
            }).catch((error) => {
                console.error(error);
            })
        }else{
            if (imagesToDelete.length > 0) {
                console.log(imagesToDelete);
                const resDeleteImages = await deleteImagesProducto(imagesToDelete, producto?.id);
                if (resDeleteImages.success === false) {
                    showToast(resDeleteImages.message, 'error');
                    return;
                }
            }
            
            if (uploadCaruselFiles.length > 0) {
                const formDataImages = new FormData();
                uploadCaruselFiles.forEach((file) => {
                    formDataImages.append('imagenes', file);
                });
                const resInsertImages = await insertManyImagesProducto(formDataImages, id);
                if (resInsertImages.success === false) {
                    showToast(resInsertImages.message, 'error');
                    return;
                }
            }
        

            const resUpdateProducto = await updateProducto(id , formData);
            if (resUpdateProducto.success === true) {
                showToast('Producto actualizado correctamente', 'success');
                router.push('/home/productos');
            }else{
                showToast(resUpdateProducto.message, 'error');
            }

        }
    }

    const addFocus = (id : string) => {
        let input = document.getElementById(id) as HTMLInputElement;
        if (input) {
            input.focus();
        }
    }

    const showToast = (message: string, type: string) => {
        return toast(message, {
            type: type,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <>
            { (id !== '' && loading === false) ? (
                <div className = {style.container}>
                    <h1>{
                        id === 'create' ? 'Crear Producto' : 'Editar Producto'
                    }</h1>
                    <form onSubmit={onSubmitForm} className={style.form}>
                        <div className="flex flex-row gap-4 w-full">
                            <Input
                                size="md"
                                label="Nombre"
                                name="nombre"
                                variant="bordered"
                                placeholder="Ingrese un nombre"
                                value={producto?.nombre}
                                onChange={(e) => setProducto({...producto, nombre: e.target.value})}
                                isInvalid={producto?.nombre === '' && clickSendForm}
                                errorMessage={(producto?.nombre === '' && clickSendForm) ? 'El nombre es requerido' : ''}
                                color={(producto?.nombre === '' && clickSendForm) ? 'danger' : ''}
                                isRequired
                                autoFocus
                            />
                            <Input
                                size="md"
                                label="Precio"
                                type = "number"
                                min="0"
                                name="precio"
                                id="precio"
                                variant="bordered"
                                step='0.01'
                                placeholder="Ingrese el precio"
                                value={producto?.precio}
                                onChange={(e) => {
                                    setProducto({...producto, precio: e.target.value})
                                }}
                                isInvalid={producto?.precio === 0 && clickSendForm}
                                errorMessage={(producto?.precio === 0 && clickSendForm) ? 'El precio no puede ser 0' : ''}
                                color={(producto?.precio === 0 && clickSendForm) ? 'danger' : ''}
                                isRequired
                            />
                        </div>
                        
                        <div className="flex flex-row gap-4 w-full">
                            <Input
                                type="number"
                                min="0"
                                step="1"
                                size="md"
                                label="Stock"
                                name="stock"
                                placeholder="Ingrese el Stock"
                                variant="bordered"
                                value={producto?.stock}
                                isInvalid={producto?.stock === 0 && clickSendForm}
                                errorMessage={(producto?.stock === 0 && clickSendForm) ? 'El stock no puede ser 0' : ''}
                                color={(producto?.stock === 0 && clickSendForm) ? 'danger' : ''}
                                onChange={(e) => {
                                    let integer = parseInt(e.target.value);
                                    setProducto({...producto, stock: integer})
                                }}
                                isRequired
                            />

                            <Input
                                size="md"
                                label="Peso"
                                type = "number"
                                min="0"
                                name="peso"
                                id="peso"
                                variant="bordered"
                                step='0.01'
                                placeholder="Ingrese el peso"
                                value={producto?.peso}
                                onChange={(e) => {
                                    setProducto({...producto, peso: e.target.value})
                                }}
                                isInvalid={producto?.peso === 0 && clickSendForm}
                                errorMessage={(producto?.peso === 0 && clickSendForm) ? 'El peso no puede ser 0' : ''}
                                color={(producto?.peso === 0 && clickSendForm) ? 'danger' : ''}
                                isRequired
                            />
                        </div>
                        <Divider orientation="horizontal"/>
                        <Textarea
                            size="md"
                            minRows={5}
                            maxRows={7}
                            variant="bordered"
                            label="Descripcion"
                            name="descripcion"
                            placeholder="Ingrese una descripcion"
                            isInvalid={producto?.descripcion === '' && clickSendForm}
                            errorMessage={(producto?.descripcion === '' && clickSendForm) ? 'La descripcion es requerida' : ''}
                            value={producto?.descripcion}
                            onChange={(e) => setProducto({...producto, descripcion: e.target.value})}
                            isRequired
                        />
                        <Divider orientation="horizontal"/>
                        <span className={style.labels}>Imagenes del Producto</span>
                        <div className={style.flex_column}>
                            <Slider imgs_backend={id === 'create' ? [] : producto?.imagenes} 
                                    imgs_to_upload={uploadCaruselBase64} on_delete_image={eliminarImagenCarusel} 
                                    on_check_image={onClickCheckImage}
                                    />
                            <span className={style.error}
                                    style={{display: (id === 'create' && clickSendForm && uploadCaruselBase64.length === 0) ? 'block' : 'none'}}
                                >Debe de cargar una imagen en el Carusel*</span>

                            <div className='flex_center_h'>
                                <label htmlFor="carusel" className={`hover_button ${style.customUpload}`}>
                                    Cargar imagenes
                                </label>
                                <input className={style.inputFile} id="carusel" type="file" accept="image/*"
                                        onChange={onFilesImagesChangeCarusel} multiple/>
                            </div>
                        </div>
                        <Divider orientation="horizontal"/>
                        
                        <input type="submit" value={
                            id === 'create' ? 'Crear Producto' : 'Guardar Cambios'
                        } className={`hover_button ${style.submit_button}`} />
                    </form>
                </div>
            ) : null}
            {
                loading ? (
                    <CircularProgress className="loading" color="danger" label="Cargando..." />
                ) : null
            }
        </>
    );
};

export default FormPage;