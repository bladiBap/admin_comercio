import style from './slider-img.module.css';
import {Image, Button, Checkbox} from "@nextui-org/react";

interface SlideProps {
    imgs_backend: string[];
    imgs_to_upload: string[];
    on_delete_image: any;
    on_check_image: any;
}

const base_url = process.env.NEXT_PUBLIC_API_URL;

const Slider = ({imgs_backend, imgs_to_upload, on_delete_image, on_check_image}: SlideProps) => {
    
    return (
        <div className = {style.slider_container}>
            { imgs_backend.length === 0 &&  imgs_to_upload.length === 0 && (
                <div className={style.sin_imagenes}>
                    <p>No se cargo ninguna imagen</p>
                </div>
            )}

            {
                imgs_backend !== undefined && imgs_backend.length > 0 &&
                imgs_backend.map((img, index) => {
                    return (
                        <div key={index} className={style.slide}>
                            <Image className={style.img} src={`${base_url}/${img?.img_url}`} alt='imagenes del producto' width={400} height={300}/>
                            <Checkbox color="danger" onChange={() => on_check_image(img.id)} > Eliminar </Checkbox>
                        </div>
                    )
                })
            }

            {
                imgs_to_upload !== undefined && imgs_to_upload.length > 0 &&
                imgs_to_upload.map((img, index) => {
                    return (
                        <div key={index} className={style.slide} style={{backgroundColor: '#E5FFE7'}}>
                            <Image className={style.img} src={img} alt='imagenes a subir' width={400} height={300} />
                            <Button variant="solid" color="danger"
                                onPress={() => on_delete_image(index)}
                            >Eliminar</Button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Slider;