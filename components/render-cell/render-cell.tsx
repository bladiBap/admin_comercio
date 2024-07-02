import {
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip
} from "@nextui-org/react";
import { FaEdit, FaPrescriptionBottle  } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import {useCallback} from "react";
import Image from "next/image";
import style from "./render-cell.module.css";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const base_url = process.env.NEXT_PUBLIC_API_URL;

interface IRenderCellProps {
    item: any;
    columnKey: string;
    action_img?: any;
    onClickMenu?: any;
    banner?: string | null;
    onViewDetail?: any;
    completarOrden?: any;
}

const RenderCell = ({item, columnKey, action_img, onClickMenu, banner,
    onViewDetail = () => {}, completarOrden = () => {}
}: IRenderCellProps) => {
    const renderCell = useCallback(() => {
        switch (columnKey) {
            case "opciones":
                return (
                    <div 
                        className="relative flex justify-center items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button color="danger" size="md">
                                    Opciones
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                onAction={(key) => onClickMenu(key, item)}
                                >
                                {
                                    (item.completado === true || item.completado === false)? (
                                        <DropdownItem key="completar" >
                                            <div className="flex items-center space-x-2" >
                                                <FaEdit /> <span>Completar Orden</span>
                                            </div>
                                        </DropdownItem>
                                    ): (
                                        <DropdownItem key="edit" >
                                            <div className="flex items-center space-x-2" >
                                                <FaEdit /> <span>Editar</span>
                                            </div>
                                        </DropdownItem>
                                    )
                                }
                                <DropdownItem key="delete" className="text-danger" color="danger" >
                                    <div className="flex items-center space-x-2" >
                                        <FaPrescriptionBottle  /> <span>Eliminar</span>
                                    </div>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case "banner":
                return (
                    <div className={style.container_img}>
                        <Slide>
                            {item.imagenes.map((slideImage, index)=> (
                                <div key={index + 'h'}>
                                    <div className={style.slider + " "+ style.size_img} onClick={()=>{action_img(slideImage.img_url)}}
                                        style={{'backgroundImage': `url(${base_url}/${slideImage.img_url})`}}>
                                        
                                    </div>
                                    
                                </div>
                            ))} 
                        </Slide>
                        <p className={style.txt_view}>Ver</p>
                    </div>
                );
            case "completado":
                return (
                    <Chip className="capitalize" color={item.completado ? "success" : "danger"}
                        size="lg" variant="flat">
                        {item.completado ? "Entregado" : "No entregado"}
                    </Chip>
                );
            case "detalle":
                return (
                    <Button style={{color: '#fff'}}
                        color="warning" size="md" onClick={() => {
                        onViewDetail(item);
                    }}>
                        Ver detalle
                    </Button>
                );
            case "esdelivery":
                return (
                    <Chip key={item.id} 
                        color={item.esdelivery ? "success" : "default"}
                        size="lg" variant="flat">
                        <div className="capitalize"  style={{display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '0.5rem'}}>
                            {item.esdelivery ? <MdDeliveryDining /> : <FaShop />}
                            {item.esdelivery ? "Delivery" : "En tienda"}
                        </div>
                    </Chip>
                );
            default:
                return (
                    <p className={`max-w-sm truncated-paragraph font-hairline ${columnKey === "descripcion" ? "" : "font-semibold text-base"}`}> 
                        {item[columnKey]}
                    </p>
                );
        }
    }, [
        columnKey,
        item,
        action_img,
        onClickMenu,
        onViewDetail
    ]);

    return (
        <>
            {renderCell()}
        </>
    );
};

export default RenderCell;