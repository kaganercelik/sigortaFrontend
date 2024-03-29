import React, { useState } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { MainContext, useContext } from "../contex";
import SideBarLinks from "../components/SideBarLinks";
import AlacakGoster from "../components/AlacakGoster";
import VerecekGoster from "../components/AlacakGoster";

export default function VerecekTek(props) {

    const navigate = useNavigate();
    const{alacakId,isId,verecekId,erisimKodu,isTuru} = useContext(MainContext);
    const [verecekData,setVerecekData] = useState({});
    const [initialData,setInitialData] = useState({
        erisimKodu: erisimKodu,
        isId:isId,
        verecekId: verecekId,
        isTuru:props.propIsTuru

    })
     

    const fetchVereceklerData = async () => {
        const response = await fetch("http://127.0.0.1:5000/verecekler/goster/",{
            method:"POST",
            mode:'cors',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(initialData)
        })

        const data= await response.json();
        setInitialData({
            ...initialData,
            miktar: data.filter((item) => {return item.id === verecekId})[0].miktar,
            aciklama : data.filter((item) => {return item.id === verecekId})[0].aciklama

       })
        setVerecekData({
            ...verecekData,
            miktar: data.filter((item) => {return item.id === verecekId})[0].miktar,
            aciklama : data.filter((item) => {return item.id === verecekId})[0].aciklama
        })
    }

    const guncelle = async () => {
        const response = await fetch("http://127.0.0.1:5000/verecekler/guncelle/",{
            method:"POST",
            mode:'cors',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(initialData)
        })
    }


    useEffect(() => {
        fetchVereceklerData();
        
    },[])
   
    const sil = async () => {
        const response = await fetch("http://127.0.0.1:5000/verecekler/sil/",{
            method:"POST",
            mode:'cors',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                erisimKodu:erisimKodu,
                verecekId: verecekId
            })
        })

        const returnVAL = await response.json();
        console.log(returnVAL.durum);
        
    }
    

    const silClick = () => {
        if(window.confirm("Verecek Silinecek Emin Misiniz?") == true){
            sil();
            if(isTuru === 0){
                navigate("/is/bireysel/arsiv/tek");
        
            }
            else if(isTuru === 1){
                navigate("/is/ortak/arsiv/tek");
        
            }
        }
    }

    const guncelleClick = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        initialData["tarih"] = today;
        guncelle();
        if(isTuru === 0){
            navigate("/is/bireysel/arsiv/tek");
    
        }
        else if(isTuru === 1){
            navigate("/is/ortak/arsiv/tek");
    
        }
    }

   
    return (
    <div>
        {/* navbar */}
        <div className="navbar bg-base-100 shadow">
            <div className="flex-none">
             
                <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></label>
            </div>
            <div className="flex-1">
                <a href="/home" className="btn btn-ghost normal-case text-xl">Biçerer Sigorta</a>
            </div>
            <div className="flex-none">
            <a className='btn btn-error hover:text-white' href="/logout">Çıkış Yap</a>
            </div>
        </div>
        <div className="drawer ">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-screen h-screen flex flex-column  align-center">
                 {/* Toggle Button */}

                <div className="w-100 h-100 d-flex justify-content-center align-items-start  h-25">
                    <div className="d-flex flex-column justify-content-center align-items-center w-75 h-100  rounded">
                        <div className="text-center my-5">
                            <h1><b style={{'fontSize':'30px'}}>Yapmak Istediginiz islemi seciniz:</b></h1>
                        </div>
                    <div className="d-flex justify-content-center">
                        
                        <a onClick={silClick} className='btn bg-red-500 text-black hover:bg-red-300 hover:text-white mx-2'>Sil</a>
                    </div>

                   <div className="d-flex flex-column justify-content-center align-items-center">
                        <label htmlFor="aciklama">Aciklama</label>
                        <input className='form-control' onChange={(e) => {initialData["aciklama"] = e.target.value }} type="text" name="aciklama" placeholder={verecekData.aciklama}  />
                        <br />

                        <label htmlFor="miktar">Miktar</label>
                        {/* placeholder={alacakdata.miktar}  */}
                        <input className='form-control' onChange={(e) => {initialData["miktar"] = e.target.value }} type="number" name="miktar" placeholder={verecekData.miktar}  />
                        <br />

                        <button onClick={guncelleClick} className='btn bg-green-200' >Guncelle</button>

                    </div>
                    </div>
                   
            
                   

                </div>
                
            </div> 
            <div className="drawer-side ">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">

                <SideBarLinks></SideBarLinks>
                
                </ul>
            </div>  
        </div>

    </div>
  )

}
