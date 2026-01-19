const speedElement = document.querySelector("#speed")
const startBtn = document.querySelector("#start")
const stopBtn = document.querySelector("#stop")

let watchId = null
let currentRide = null
startBtn.addEventListener("click",() => {

    if(watchId)
        return
        
    function handleSuccess(position){
        addPosition(currentRide,position)
        console.log(position)
        speedElement.innerText = position.coords.speed ? // se speed for nulo retorna 0 , no caso o speed aq retorna como metros por seg , ent usei 3.6
        (position.coords.speed *3.6).toFixed(1):0 
    }

    function handleError(error){
        console.log(error.msg)
    }

    const options = { enableHighAccuraccy:true}
    currentRide = createNewRide() //criando o dado antes de inicializar o wathPosition
    watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options)
    startBtn.classList.add("d-none")
    stopBtn.classList.remove("d-none")

})

stopBtn.addEventListener("click", () => {
    
    if(!watchId)
        return
    navigator.geolocation.clearWatch(watchId)
    watchId = null
    updateStopTime(currentRide)
    currentRide = null
    startBtn.classList.remove("d-none")
    stopBtn.classList.add("d-none")
    window.location.href = "./index.html"
    
})
