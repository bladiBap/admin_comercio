import {
    Modal, ModalContent, 
    ModalHeader, ModalBody, 
    ModalFooter, Button
} from "@nextui-org/react";

import { useState } from "react";

interface ModalConfirmProps {
    openModal: boolean;
    onCloseModal: any;
    onClickConfirm: any;
    textModal: string;
    titleModal: string;
}

const ModalConfirm = ({onClickConfirm, textModal, openModal, onCloseModal, titleModal }: ModalConfirmProps) => {

    return (
        
            <Modal isOpen={openModal} backdrop="blur"
                hideCloseButton={true}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1"
                        style={{backgroundColor: '#B80000', color : '#fff'}}
                        >{titleModal}</ModalHeader>
                    <ModalBody style={{padding: '2rem'}}>
                        <p dangerouslySetInnerHTML={{ __html: textModal }} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" onPress={onCloseModal}>
                        Cancelar
                        </Button>
                        <Button color="danger" onPress={onClickConfirm}>
                            Aceptar
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        
    );
}

export default ModalConfirm;