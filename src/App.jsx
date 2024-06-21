import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import clsx from "clsx"
import { getKoders, createKoder ,deleteKoder } from './api'


export default function App() {
  const [koders, setKoders] = useState([])

// useEffect recibe 2 parametros
  //1. una funcion
//2. arreglo de dependencias
// se utiliza para ejecutar codigo en partes especificas del ciclo de vida de un componente
// useEffect se ejecuta en 2 momentos cuando el componente se monta o renderiza por primera vez 
// cuando cambia alguna de sus dependencias
   useEffect(() => {
    console.log("Hola desde useEffect");
    getKoders()
    .then((koders) => {
      console.log("koders: ", koders)
      setKoders(koders)
    })
    .catch((error) => {
      console.error("Error al obtener koders", error)
      alert("Error al obtener koders");
    })
   }, [])

  const {
    register,
    handleSubmit,
    formState : { errors, isValid, isSubmitted},
    reset,
    setFocus
  } = useForm()
  

  function removeKoder(idxToRemove) {
    const newKoders = koders.filter((koder, idx) => idx !== idxToRemove)
    setKoders(newKoders)
  }

  async function onSubmit(data) {
    try {
      await createKoder({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
  
      const kodersList = await getKoders();
      setKoders(kodersList);
      setFocus("firstName")
      reset()
    } catch (error) {
      console.error("Error al crear koders", error)
      alert("Error al crear koders");
    }
  }

  function OnDelete(koderId) {
    deleteKoder(koderId)
    .then(() => {
      getKoders()
      .then((koders) => {
        setKoders(koders);
      })
      .catch((error) => {
        console.error("Error al obtener koders", error)
        alert("Error al obtener koders");
      })
    })
    .catch((error) => {
      console.error("Error al eliminar koders", error)
      alert("Error al eliminar koders");
    })
  }

  return (
    <main className='w-full min-h-screen flex flex-col'>
      <p className='w-full bg-[#373D35] text-center p-2 font-bold'>Registro de koders</p>
      <form className='flex md:flex-row gap-2 justify-center p-5 text-black flex-col'
            onSubmit={handleSubmit(onSubmit)}
      >
        <input type="text"
               placeholder='Nombre del koder'
               required
               className={clsx("p-2 rounded-md w-full md:max-w-80", {
                "border-2 border-red-500 bg-red-300" :errors.firstName
               })}
               {...register("firstName", {
                required: {value: true, message: "Nombre requerido"},
                minLength: {value: 3, message: "Minimo 3 caracteres"},
                maxLength: {value: 45, message: "Maximo 45 caracteres"},
               })} 
               />
        <input type="text" 
               placeholder='Apellido del koder'
               required
               className={clsx("p-2 rounded-md w-full md:max-w-80", {
                "border-2 border-red-500 bg-red-300" : errors.lastName
               })}
               {...register("lastName", {
                required: {value: true, message: "Apellido requerido"},
                minLength: {value: 3, message: "Minimo 3 caracteres"},
                maxLength: {value: 45, message: "Maximo 45 caracteres" }
               })} 
               />
        <input type="email"
               placeholder='Koder email'
               required
               className={clsx("p-2 rounded-md w-full md:max-w-sm", {
                "border-2 border-red-500 bg-red-300" : errors.email
               })}
               {...register("email", {
                required: {value: true, message: "email requerido"},
                minLength: {value: 3, message:"Minimo 3 caracteres"},
                maxLength: {value: 80, message: "Maximo 80 caracteres"},
               })}
               />
        <button className='px-3 rounded bg-white text-black disabled:bg-[#212720] disabled:text-white'
                disabled={isSubmitted ? !isValid : false}>Agrega un Koder</button>
      </form>
      {(errors.firstName || errors.lastName || errors.email) && (
        <div className='flex flex-row justify-center'>
          {errors.firstName && (
        <p className='text-red-500 text-center text-sm font-semibold mx-4'>
          {errors.firstName?.message}
        </p>
      )}
      {errors.lastName && (
        <p className='text-red-500 text-center text-sm font-semibold mx-4'>
          {errors.lastName?.message}
        </p>
      )}
      {errors.email && (
        <p className='text-red-500 text-center text-sm font-semibold mx-4'>
          {errors.email?.message}
        </p>
      )}
        </div>
      )}
      <div className='max-w-screen-sm w-full mx-auto p-4 flex flex-col gap-1'>
        {
          koders.length === 0 && (<p className='text-white/50 text-3xl text-center'>No hay koders registrados</p>)
        }
        {
          koders.map((koder, idx) => {
            return ( 
              <div key={`koder-${idx}`} className='bg-white/10 p-4 flex flex-row justify-between'>
                <span className='select-none'>{`${koder.firstName} ${koder.lastName} - ${koder.email}`}</span>
                <span className='text-red-500 cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-1 size-5 flex text-center items-center'
                onClick={() => OnDelete(koder.id)}>x</span>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}

