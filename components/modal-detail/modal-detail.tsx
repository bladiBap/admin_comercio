import {
    Modal, ModalContent, 
    ModalHeader, ModalBody, 
    ModalFooter, Button, Accordion, AccordionItem, User
} from "@nextui-org/react";
import Image from "next/image";
import style from "./modal-detail.module.css";

interface ModalConfirmProps {
    openModal: boolean;
    onCloseModal: any;
    titleModal: string;
    pedido: any;
}

const base_Url = process.env.NEXT_PUBLIC_API_URL;

const ModalDetail = ({pedido, openModal, onCloseModal, titleModal }: ModalConfirmProps) => {

    return (
        
            <Modal isOpen={openModal} backdrop="blur" size='2xl'
                hideCloseButton={true}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-row gap-1 justify-between"
                        style={{backgroundColor: '#B80000', color : '#fff'}}
                        >   
                            {titleModal}
                            
                            <Button style={{backgroundColor: '#B80000', color: '#fff', padding: '0rem', height: '1.5rem'}}
                                onPress={onCloseModal}>
                                X
                            </Button>
                        </ModalHeader>
                    <ModalBody>
                        <section className={style.order_container}>
                            <div className={style.order_header}>
                                <div className = {style.order_info}>
                                    <h3 className={style.order_info_txt}>
                                        Orden # {pedido.id}
                                    </h3>
                                    <h3 className={style.order_info_txt}>
                                        Ticket: {pedido.ticket}
                                    </h3>
                                    <h3>
                                        {pedido.fecha}
                                    </h3>
                                </div>
                                <div style={{padding: '0.3rem', border: '1px solid #eaeaea', borderRadius: '10px'}}>
                                    <User   
                                        name= {pedido.usuario.nombre + " " + pedido.usuario.apellido}
                                        description= {pedido.usuario.email}
                                        avatarProps={{
                                            src: `${base_Url}/${pedido.usuario.img_url}`,
                                            alt: pedido.usuario.nombre,
                                            size: 'md',
                                        }}
                                        />
                                </div>
                            </div>
                            <div>
                                <h3 className={style.subtitle_detail}>Dirección:</h3>
                                <h3 className={style.subtitle_detail_gray}>{pedido.direccion}</h3>
                            </div>
                                <Accordion>
                                    <AccordionItem key="1" aria-label="Accordion 1" subtitle={"Total: " + pedido.total +" Bs."}
                                        title="Lista de productos">
                                        <div className={style.order_products}>
                                            {pedido.detalles.map((detalle, index) => {
                                                return (
                                                    <div key={index+'b'} className={style.product_container}>
                                                        <figure>
                                                            <Image src={
                                                                `${base_Url}/${detalle.producto.imagenes[0].img_url}`
                                                                } alt={detalle.producto.nombre} 
                                                                className={style.product_image_container}
                                                                unoptimized
                                                                priority={true}
                                                                width={100} height={100} />
                                                        </figure>
                                                        <div className={style.product_description}>
                                                            <h4 className={style.subtitle_detail}>{detalle.producto.nombre}</h4>
                                                            <h4 className = {style.subtitle_detail_gray}>Cantidad: {detalle.cantidad}</h4>
                                                            <h4 className={style.subtitle_detail}>{detalle.producto.precio} Bs.</h4>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            </section>
                    </ModalBody>
                    </>
                )}
                </ModalContent>
            </Modal>
        
    );
}

export default ModalDetail;