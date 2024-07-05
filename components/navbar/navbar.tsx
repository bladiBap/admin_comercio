'use client';
import style from './navbar.module.css';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoLogOut } from "react-icons/io5";
import {Navbar, NavbarContent, NavbarItem, 
    Link,Button, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from '@nextui-org/react';
import { getUsuarioByToken } from '@/services/usuario-service';

export default function Navigation() {
    const router = useRouter();
    const [areUser, setAreUser] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activePages, setActivePages] = useState<[]>([
        {nombre: "Pedidos", ruta: "pedidos",  id: 1},
        {nombre: "Productos", ruta: "productos",  id: 2}
    ]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token){
            getUsuarioByToken(token).then((res) => {
                if (res.success){
                    setAreUser(true);
                    sessionStorage.setItem("usuario", JSON.stringify(res.data));
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }, []);

    const GetUserImage = () => {
        let user = JSON.parse(sessionStorage.getItem("usuario"));
        if (user === undefined || user.img_url === null || user.img_url === "") {
            return "/image/none_user.png";
        }else{
            return user.img_url;
        }
    }

    const esRutaActiva = (ruta: string, rutaActual: string) => {
        if (ruta === '/' && rutaActual === '/') {
            return true;
        } else if (ruta === '/') {
            return false;
        }
        return rutaActual.startsWith(ruta);
    }

    const GetItemNav = (item: any) => {
        const rutaActual = usePathname();
        return (
            <NavbarItem key={item.id} isActive={item.isActive}>
                <Link 
                    style={{fontWeight: esRutaActiva(item.ruta, rutaActual) ? "bold" : "normal",
                    color: "#fff",
                    cursor: "pointer",
                    borderBottom: esRutaActiva(item.ruta, rutaActual) ? "2px solid #fff" : "none"
                    }}
                    color="foreground"
                    onClick={() => {
                        router.push(item.ruta)
                    }}
                >
                    {item.nombre}
                </Link>
            </NavbarItem>
        )
    }

    const GetItemMobile = (item: any) => {
        const rutaActual = usePathname();
        return (
            <NavbarMenuItem key={item.id}>
                <Link 
                    style={{fontWeight: esRutaActiva(item.ruta, rutaActual) ? "bold" : "normal",
                    color: "#000",
                    cursor: "pointer",
                    borderBottom: esRutaActiva(item.ruta, rutaActual) ? "2px solid #000" : "none"
                    }}
                    color="foreground"
                    href={item.ruta}
                    >
                    {item.nombre}
                </Link>
            </NavbarMenuItem>
        )
    }


    return (
        <Navbar 
            className={`${style.navbar} padding-main`}
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            style={{
            backgroundColor: "var(--color-primary)",
        }}>
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                    style={{color: "#fff"}}
                />
                <NavbarContent>
                    <Image
                        className={style.logo}
                        src="/image/logo.webp"
                        alt="Logo"
                        width={40}
                        height={40}
                        unoptimized
                        priority={true}
                    />
                    {activePages.map((item) => GetItemNav(item))}
                    <Button
                        isIconOnly
                        style={{backgroundColor: "transparent"}}
                        onPress = {() => {
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("usuario");
                            router.push("/");
                        }}
                        >
                        <IoLogOut size={30} color="#fff"/>
                    </Button>
                </NavbarContent>
            </NavbarContent>
            <NavbarMenu>
                {activePages.map((item, index) => (
                    GetItemMobile(item)
                ))}
            </NavbarMenu>
        </Navbar>
    )
}