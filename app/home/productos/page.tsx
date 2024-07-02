"use client"
import RenderCell from '@/components/render-cell/render-cell';
import ModalImg from '@/components/modal-img/modal-img';
import ModalConfirm from '@/components/modal-confirm/modal-confirm';
import {getProductos, searchProductos, deleteProducto} from '@/services/producto-service';
import {getUsuarioByToken} from '@/services/usuario-service';
import { toast } from 'react-toastify';
import {IEvento} from '@/models/evento';
import {
    useState, 
    useMemo,
    useCallback,
    useEffect
} from 'react';
import { useRouter } from 'next/navigation';
import { 
    BsSearch,
    BsPlus
} from "react-icons/bs";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    SortDescriptor,
    CircularProgress
} from "@nextui-org/react";

const EventosPage = () => {
    const [textoBuscar, setTextoBuscar] = useState("");
    const [loadingState, setLoadingState] = useState("loading");
    const [loadingPage, setLoadingPage] = useState(true);
    const [listaProductos, setListaProductos] = useState<IEvento[]>([]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({column: "id", direction: "ascending"});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [urlImg, setUrlImg] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [idDelete, setIdDelete] = useState("");
    const router = useRouter();

    const columnas = [
        {name: "ID", uid: "id", sortable: true},
        {name: "NOMBRE", uid: "nombre", sortable: true},
        {name: "DESCRIPCION", uid: "descripcion", sortable: false},
        {name: "PRECIO (Bs)", uid: "precio", sortable: true},
        {name: "STOCK", uid: "stock", sortable: true},
        {name: "BANNER", uid: "banner", sortable: false},
        {name: "OPCIONES", uid: "opciones", sortable: false},
    ];

    const ordenarProductos = useMemo(() => {
        return [...listaProductos].sort((a, b) => {
            const first = a[sortDescriptor.column] as number;
            const second = b[sortDescriptor.column] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [
        sortDescriptor,
        listaProductos
    ]);

    const fetchProductos = useCallback(() => {
        if (textoBuscar !== ""){
            searchProductos(textoBuscar, page, pageSize)
            .then((res) => {
                if (res.success !== true){
                    console.error(res.message);
                }else{
                    setListaProductos(res.data.productos);
                    setTotalPages(res.data.total_pages)
                }
                setLoadingState("idle");
            });
        }else{
            getProductos(page, pageSize)
            .then((res) => {
                if (res.success !== true){
                    console.error(res.message);
                }else{
                    setListaProductos(res.data.productos);
                    setTotalPages(res.data.total_pages);
                }
                setLoadingState("idle");
            });
        }
    }, [
        textoBuscar,
        page,
        pageSize
    ]);

    useEffect(() => {
        const fetchData = async () => {
            let res = await getUsuarioByToken();
            if (res.success === true) {
                setLoadingPage(false);
                fetchProductos();
            }else{
                router.push("/");
            }
        }
        fetchData();
    }, [
        fetchProductos,
        router
    ]);

    const viewFullScreen = useCallback((url: string) => {
        setUrlImg(url);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value && value.trim() !== ""){
            setTextoBuscar(value);
            setPage(1);
        }else{
            setTextoBuscar("");
        }
    }, []);

    const onClearTextoBuscar = useCallback(() => {
        setTextoBuscar("");
    }, []);

    const nextPage = useCallback(() => {
        if (page < totalPages){
            setPage(page + 1);
        }
    }, [page, totalPages]);

    const prevPage = useCallback(() => {
        if (page > 1){
            setPage(page - 1);
        }
    }, [page]);

    const onClickMenuItem = useCallback((key: string, item: IEvento) => {
        switch (key) {
            case "edit":
                router.push(`/home/productos/${item.id}`);
                break;
            case "delete":
                setIdDelete(item.id);
                setOpenModal(true);
                break;
            default:
                break;
        }
    }, [
        router
    ]);

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

    const confirmModalDelete = useCallback(() => {
        if (idDelete !== ""){
            deleteProducto(idDelete)
            .then((res) => {
                if (res.success !== true){
                    console.error(res.message);
                    showToast(res.message, "error");
                }else{
                    fetchProductos();
                    showToast(res.message, "success");
                }
                setOpenModal(false);
            });
        }
    }, [
        idDelete,
        fetchProductos
    ]);

    const getTopContent= useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        startContent={<BsSearch className="icon" />}
                        value={textoBuscar}
                        onClear={() => onClearTextoBuscar()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button 
                        onPress={() => router.push('/home/productos/create')}
                        color="danger" endContent={<BsPlus style={{color: "white", width: "20px", height: "20px"}}></BsPlus>} >
                            Agregar nuevo
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [
        textoBuscar,
        onSearchChange,
        onClearTextoBuscar,
        router
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    Página {page} de {totalPages}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="danger"
                    page={page}
                    total={totalPages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={totalPages === 1} size="sm" variant="flat" onPress={prevPage}>
                        Anterior
                    </Button>
                    <Button isDisabled={totalPages === 1} size="sm" variant="flat" onPress={nextPage}>
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    }, [page, totalPages, nextPage, prevPage]);

    return (
        <>
            <ModalImg img_url={urlImg} onClose={() => setUrlImg("")} />
            <ModalConfirm openModal={openModal} onCloseModal={() => setOpenModal(false)} 
            onClickConfirm={confirmModalDelete} textModal="Esta seguro que desea Eliminar el Producto?"
            titleModal = "Eliminar Producto"/>

            { (loadingPage === true) ? <CircularProgress className="loading" color="danger" label="Cargando..." /> :
            <Table
                className="p-5"
                aria-label="Productos"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[700px]",
                }}
                sortDescriptor={sortDescriptor}
                topContent={getTopContent}
                topContentPlacement="outside"
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={columnas}>
                    {(columna) => (
                        <TableColumn
                            key={columna.uid}
                            align={columna.uid === "opciones" ? "center" : "start"}
                            allowsSorting={columna.sortable}
                        >
                            {columna.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody 
                    emptyContent={loadingState === "loading" ? "Cargando productos..." : "No se encontraron productos"}
                    items={ordenarProductos}
                >
                    {
                        (evento) => (
                            <TableRow key={evento.id}>
                                {(columnKey) => 
                                    <TableCell>
                                        <RenderCell item={evento} columnKey={columnKey} action_img={(url)=>{
                                            viewFullScreen(url);
                                        }} 
                                            onClickMenu={onClickMenuItem} banner={evento.banner_url}
                                        />
                                    </TableCell>
                                    }
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
            }
        </>
    );
};

export default EventosPage;