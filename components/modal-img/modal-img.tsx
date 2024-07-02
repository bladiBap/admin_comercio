import style from "./modal-img.module.css";
import Image from "next/image";

interface IModalImgProps {
    img_url: string;
    onClose: any;
}

const base_url = process.env.NEXT_PUBLIC_API_URL;

const ModalImg = ({img_url, onClose}: IModalImgProps) => {
    return (
        <div className={`${style.full_screen_modal} ${img_url !== "" ? style.set_opacity : ""}`}
                onClick={onClose}
            >
                {img_url !== "" && (
                    <Image 
                        src={`${base_url}/${img_url}`}
                        alt="Imagen"
                        width={500}
                        height={300}
                        className={`${style.img_full_screen}`}
                        unoptimized
                        priority={true}
                    />
                )}
            </div>
    );
};

export default ModalImg;