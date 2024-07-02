"use client"
import RenderCell from '@/components/render-cell/render-cell';
import ModalConfirm from '@/components/modal-confirm/modal-confirm';
import ModalDetail from '@/components/modal-detail/modal-detail';
import {getPedidos, searchPedidos, deletePedido, getPedidoById,completarPedido} from '@/services/pedido-service';
import {getUsuarioByToken} from '@/services/usuario-service';
import { toast } from 'react-toastify';
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

const PedidosPage = () => {
    const [textoBuscar, setTextoBuscar] = useState("");
    const [loadingState, setLoadingState] = useState("loading");
    const [loadingPage, setLoadingPage] = useState(true);
    const [listaProductos, setListaProductos] = useState([]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({column: "id", direction: "ascending"});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [idDelete, setIdDelete] = useState("");
    
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [pedido, setPedido] = useState({});
    
    const [openModalCompletar, setOpenModalCompletar] = useState(false);
    

    const router = useRouter();

    const columnas = [
        {name: "ID", uid: "id", sortable: true},
        {name: "TICKECT", uid: "ticket", sortable: false},
        {name: "COMPLETADO", uid: "completado", sortable: true},
        {name: "TIPO" , uid: "esdelivery", sortable: true},
        {name: "DETALLE", uid: "detalle", sortable: false},
        {name: "TOTAL (Bs)", uid: "total", sortable: true},
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

    const fetchPedidos = useCallback(() => {
        if (textoBuscar !== ""){
            searchPedidos(textoBuscar, page, pageSize)
            .then((res) => {
                if (res.success !== true){
                    console.error(res.message);
                }else{
                    setListaProductos(res.data.pedidos);
                    setTotalPages(res.data.total_pages)
                }
                setLoadingState("idle");
            });
        }else{
            getPedidos(page, pageSize)
            .then((res) => {
                console.log(res);
                if (res.success !== true){
                    console.error(res.message);
                }else{
                    setListaProductos(res.data.pedidos);
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
                fetchPedidos();
            }else{
                router.push("/");
            }
        }
        fetchData();
    }, [
        fetchPedidos,
        router
    ]);


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

    const onClickMenuItem = useCallback((key: string, item: any) => {
        switch (key) {
            case "edit":
                router.push(`/home/productos/${item.id}`);
                break;
            case "delete":
                setIdDelete(item.id);
                setOpenModal(true);
                break;
            case "completar":
                if (item.completado === true){
                    showToast("El pedido ya ha sido completado", "warning");
                }else{
                    console.log(item);
                    setPedido(item);
                    setOpenModalCompletar(true);
                }
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
            deletePedido(idDelete)
            .then((res) => {
                if (res.success !== true){
                    console.error(res.message);
                    showToast(res.message, "error");
                }else{
                    fetchPedidos();
                    showToast(res.message, "success");
                }
                setOpenModal(false);
            });
        }
    }, [
        idDelete,
        fetchPedidos
    ]);

    const onClickShowDetail = useCallback((item: any) => {
        getPedidoById(item.id).then((res) => {
            if (res.success !== true){
                console.error(res.message);
            }else{
                setPedido(res.data);
                setOpenModalDetail(true);
            }
        });
    }, []);

    const getTopContent= useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por ticket..."
                        startContent={<BsSearch className="icon" />}
                        value={textoBuscar}
                        onClear={() => onClearTextoBuscar()}
                        onValueChange={onSearchChange}
                    />
                </div>
            </div>
        );
    }, [
        textoBuscar,
        onSearchChange,
        onClearTextoBuscar
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

    const confirmModalCompletar = useCallback(() => {
        if (pedido.id !== ""){
            completarPedido(pedido.id)
            .then((res) => {
                if (res.success !== true){
                    console.error(res.message);
                    showToast(res.message, "error");
                }else{
                    fetchPedidos();
                    showToast(res.message, "success");
                }
                setOpenModalCompletar(false);
            });
        }
    }, [
        pedido,
        fetchPedidos
    ]);

    return (
        <>
            <ModalConfirm openModal={openModal} onCloseModal={() => setOpenModal(false)} 
            onClickConfirm={confirmModalDelete} textModal="Esta seguro que desea Eliminar el Pedido?"
            titleModal = "Eliminar Producto"/>

            <ModalConfirm openModal={openModalCompletar} onCloseModal={() => setOpenModalCompletar(false)}
            onClickConfirm={confirmModalCompletar} textModal={`Está seguro que desea Completar el <strong>Pedido #${pedido.id}</strong> con el <strong>ticket ${pedido.ticket}?</strong><br/><br/>
                <strong>Nota:</strong> Una vez completado el pedido no podrá ser modificado.`}
            titleModal = "Completar Pedido"/>

            <ModalDetail openModal={openModalDetail} onCloseModal={() => setOpenModalDetail(false)}
            titleModal="Detalle del Pedido" pedido={pedido}/>

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
                                            onViewDetail={onClickShowDetail}
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

export default PedidosPage;