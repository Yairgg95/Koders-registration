import { useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from "clsx"


export default function App() {
  const {
    register,
    handleSubmit,
    formState : { errors, isValid, isSubmitted},
    reset
  } = useForm()

  const [koders, setKoders] = useState([])

  function removeKoder(idxToRemove) {
    const newKoders = koders.filter((koder, idx) => idx !== idxToRemove)
    setKoders(newKoders)
  }

  function onSubmit(data) {
    setKoders([...koders, data ])
    reset();
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
               className={clsx("p-2 rounded-md w-full max-w-80", {
                "border-2 border-red-500 bg-red-300" :errors.name
               })}
               {...register("name", {
                required: {value: true, message: "Nombre requerido"},
                minLength: {value: 3, message: "Minimo 3 caracteres"},
                maxLength: {value: 45, message: "Maximo 45 caracteres"},
               })} 
               />
        <input type="text" 
               placeholder='Apellido del koder'
               required
               className={clsx("p-2 rounded-md w-full max-w-80", {
                "border-2 border-red-500 bg-red-300" : errors.lastname
               })}
               {...register("lastname", {
                required: {value: true, message: "Apellido requerido"},
                minLength: {value: 3, message: "Minimo 3 caracteres"},
                maxLength: {value: 45, message: "Maximo 45 caracteres" }
               })} 
               />
        <input type="email"
               placeholder='Koder email'
               required
               className={clsx("p-2 rounded-md w-full max-w-sm", {
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
      {(errors.name || errors.lastname || errors.email) && (
        <div className='flex flex-row justify-center'>
          {errors.name && (
        <p className='text-red-500 text-center text-sm font-semibold mx-4'>
          {errors.name?.message}
        </p>
      )}
      {errors.lastname && (
        <p className='text-red-500 text-center text-sm font-semibold mx-4'>
          {errors.lastname?.message}
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
                <span className='select-none'>{`Koder: ${koder.name} ${koder.lastname}, email: ${koder.email}`}</span>
                <span className='text-red-500 cursor-pointer hover:bg-red-500 hover:text-white rounded-full p-1 size-5 flex text-center items-center'
                onClick={() => removeKoder(idx)}>x</span>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}

